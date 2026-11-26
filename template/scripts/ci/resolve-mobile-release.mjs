#!/usr/bin/env node
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const applicationRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const prereleasePart = '(?:0|[1-9]\\d*|[0-9A-Za-z-]*[A-Za-z-][0-9A-Za-z-]*)';
const semver = new RegExp('^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-(' + prereleasePart + '(?:\\.' + prereleasePart + ')*))?$');

export function resolveMobileBuild(input) {
  const match = semver.exec(input.packageVersion ?? '');
  if (!match) throw new Error('Package version must be a valid SemVer X.Y.Z or prerelease');
  const nativeVersion = [match[1], match[2], match[3]].join('.');
  const prefix = input.tagPrefix;
  if (!['v', 'mobile/v'].includes(prefix)) {
    throw new Error('MOBILE_TAG_PREFIX must be v or mobile/v');
  }
  const tag = input.tag ?? '';
  if (!tag.startsWith(prefix)) throw new Error('Release tag has an unexpected prefix');
  const tagVersion = tag.slice(prefix.length);
  const tagMatch = semver.exec(tagVersion);
  if (!tagMatch) throw new Error('Release tag must contain a valid SemVer version');
  const tagCore = [tagMatch[1], tagMatch[2], tagMatch[3]].join('.');
  if (tagCore !== nativeVersion) {
    throw new Error('Release tag core version must match package.json');
  }
  const channel = input.channel;
  if (channel === 'beta' && !tagMatch[4]) {
    throw new Error('Beta release requires a SemVer prerelease suffix');
  }
  if (channel === 'release' && tagMatch[4]) {
    throw new Error('Stable release tag must not contain a prerelease suffix');
  }
  if (!['beta', 'release'].includes(channel)) {
    throw new Error('Unsupported mobile release channel');
  }
  if (match[4] && input.packageVersion !== tagVersion) {
    throw new Error('Declared package prerelease must exactly match release tag');
  }
  const publishMode = input.publishMode ?? 'build';
  if (!['build', 'publish'].includes(publishMode)) {
    throw new Error('Unsupported publication mode');
  }
  if (channel === 'release' && publishMode === 'publish' && input.approvedTag !== tag) {
    throw new Error('Stable store publication requires explicit approval of the exact tag');
  }
  if (channel === 'release' && publishMode === 'build' && input.approvedTag) {
    throw new Error('A release build cannot carry a publication approval');
  }
  const buildNumber = Number(input.buildNumber);
  if (!Number.isSafeInteger(buildNumber) || buildNumber < 1 || buildNumber > 2100000000) {
    throw new Error('PROJECT_BUILD_NUMBER must be a positive Android-compatible integer');
  }
  if (!/^[a-f0-9]{40}$/.test(input.commit ?? '')) {
    throw new Error('CM_COMMIT must identify an exact Git commit');
  }
  return {
    channel,
    publishMode,
    mobileVersion: tagVersion,
    nativeVersion,
    nativeBuildNumber: String(buildNumber),
    source: input.commit,
    tag,
    requiredBranch: channel === 'beta' ? 'devel' : 'main',
  };
}

function git(cwd, args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}

/**
 * Tags do not have a parent branch. Verify the tagged commit is reachable
 * from the expected remote branch; fail closed if the remote cannot be checked.
 */
export function verifyTaggedSource(release, cwd = process.cwd()) {
  const head = git(cwd, ['rev-parse', 'HEAD']);
  if (head !== release.source) throw new Error('Checked-out HEAD is not CM_COMMIT');
  const target = git(cwd, ['rev-list', '-n', '1', 'refs/tags/' + release.tag]);
  if (target !== release.source) throw new Error('Tag does not identify CM_COMMIT');

  const branch = release.requiredBranch;
  if (!['devel', 'main'].includes(branch)) throw new Error('Unexpected release source branch');
  const shallow = git(cwd, ['rev-parse', '--is-shallow-repository']) === 'true';
  const fetchArgs = ['fetch', '--no-tags'];
  if (shallow) fetchArgs.push('--unshallow');
  fetchArgs.push('origin', '+refs/heads/' + branch + ':refs/remotes/origin/' + branch);
  git(cwd, fetchArgs);

  const result = spawnSync('git', [
    'merge-base', '--is-ancestor', release.source, 'refs/remotes/origin/' + branch,
  ], { cwd, encoding: 'utf8' });
  if (result.status !== 0) {
    throw new Error('Tagged commit is not reachable from origin/' + branch);
  }
}

function main() {
  const pkg = JSON.parse(readFileSync(join(applicationRoot, 'package.json'), 'utf8'));
  const release = resolveMobileBuild({
    packageVersion: pkg.version,
    channel: process.env.MOBILE_CHANNEL,
    tagPrefix: process.env.MOBILE_TAG_PREFIX,
    tag: process.env.CM_TAG,
    buildNumber: process.env.PROJECT_BUILD_NUMBER,
    commit: process.env.CM_COMMIT,
    publishMode: process.env.MOBILE_PUBLISH_MODE,
    approvedTag: process.env.MOBILE_APPROVED_TAG,
  });
  verifyTaggedSource(release, process.env.CM_BUILD_DIR ?? process.cwd());
  const env = process.env.CM_ENV;
  if (!env) throw new Error('CM_ENV is required');
  appendFileSync(env, [
    'VERSION_NAME=' + release.nativeVersion,
    'VERSION_CODE=' + release.nativeBuildNumber,
    'MOBILE_RELEASE_VERSION=' + release.mobileVersion,
  ].join('\n') + '\n');
  const path = join(applicationRoot, 'build/release-metadata/distribution.json');
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify({
    schemaVersion: 1,
    ...release,
    workflow: process.env.CM_WORKFLOW_ID ?? null,
    buildId: process.env.CM_BUILD_ID ?? null,
  }, null, 2) + '\n');
  console.log(release.channel + ' ' + release.mobileVersion + ' from ' + release.requiredBranch);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
