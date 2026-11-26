import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { resolveMobileBuild, verifyTaggedSource } from '../../scripts/ci/resolve-mobile-release.mjs';

const commit = 'a'.repeat(40);
const defaults = {
  packageVersion: '1.2.3', channel: 'beta', tagPrefix: 'v',
  tag: 'v1.2.3-beta.2', buildNumber: '41', commit, publishMode: 'publish',
};
const mod = { ...defaults, tagPrefix: 'mobile/v', tag: 'mobile/v1.2.3-rc.2' };

test('standalone and module accept matching prerelease tags without package suffix', () => {
  for (const data of [defaults, mod]) {
    const result = resolveMobileBuild(data);
    assert.equal(result.nativeVersion, '1.2.3');
    assert.equal(result.mobileVersion, data.tag.slice(data.tagPrefix.length));
    assert.equal(result.requiredBranch, 'devel');
  }
});
test('beta accepts matching package prerelease but rejects mismatches', () => {
  assert.equal(resolveMobileBuild({ ...defaults, packageVersion: '1.2.3-beta.2' }).nativeVersion, '1.2.3');
  assert.throws(() => resolveMobileBuild({ ...defaults, packageVersion: '1.2.3-beta.1' }), /exactly/);
  assert.throws(() => resolveMobileBuild({ ...defaults, tag: 'v1.2.4-beta.2' }), /core version/);
  assert.throws(() => resolveMobileBuild({ ...defaults, tag: 'v1.2.3' }), /prerelease suffix/);
  assert.throws(() => resolveMobileBuild({ ...defaults, tag: 'mobile\/v1.2.3-beta.2' }), /prefix/);
});
test('stable build is tag-based and requires the main branch', () => {
  for (const prefix of ['v', 'mobile/v']) {
    const data = {
      ...defaults, channel: 'release', publishMode: 'build',
      tagPrefix: prefix, tag: prefix + '1.2.3',
    };
    const result = resolveMobileBuild(data);
    assert.equal(result.requiredBranch, 'main');
    assert.equal(result.mobileVersion, '1.2.3');
    assert.throws(() => resolveMobileBuild({ ...data, tag: prefix + '1.2.3-rc.2' }), /must not contain/);
  }
});
test('stable publication requires exact explicit approval', () => {
  const data = { ...defaults, channel: 'release', tag: 'v1.2.3', publishMode: 'publish' };
  assert.throws(() => resolveMobileBuild(data), /explicit approval/);
  assert.throws(() => resolveMobileBuild({ ...data, approvedTag: 'v1.2.2' }), /explicit approval/);
  assert.equal(resolveMobileBuild({ ...data, approvedTag: 'v1.2.3' }).publishMode, 'publish');
  assert.throws(() => resolveMobileBuild({ ...data, publishMode: 'build', approvedTag: 'v1.2.3' }), /cannot carry/);
});
test('rejects invalid numbers and Git commits', () => {
  assert.throws(() => resolveMobileBuild({ ...defaults, buildNumber: '0' }), /positive/);
  assert.throws(() => resolveMobileBuild({ ...defaults, commit: 'bad' }), /CM_COMMIT/);
  assert.throws(() => resolveMobileBuild({ ...defaults, tag: 'v1.2.3-beta.01' }), /valid SemVer/);
});

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim();
}
test('tag source must belong to expected branch; tag name is not proof', (t) => {
  const directory = mkdtempSync(join(tmpdir(), 'mobile-tag-test-'));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const bare = join(directory, 'origin.git');
  const local = join(directory, 'working');
  git(directory, 'init', '--bare', bare);
  git(directory, 'clone', bare, local);
  git(local, 'config', 'user.name', 'Test');
  git(local, 'config', 'user.email', 'test@example.invalid');
  git(local, 'checkout', '-b', 'main');
  git(local, 'commit', '--allow-empty', '-m', 'main');
  git(local, 'push', '-u', 'origin', 'main');
  git(local, 'checkout', '-b', 'devel');
  git(local, 'commit', '--allow-empty', '-m', 'dev');
  const devCommit = git(local, 'rev-parse', 'HEAD');
  git(local, 'tag', 'v1.2.3-beta.1');
  git(local, 'push', '-u', 'origin', 'devel');
  const beta = resolveMobileBuild({
    ...defaults, tag: 'v1.2.3-beta.1', commit: devCommit,
  });
  assert.doesNotThrow(() => verifyTaggedSource(beta, local));
  const stable = resolveMobileBuild({
    ...defaults, channel: 'release', publishMode: 'build',
    tag: 'v1.2.3', commit: devCommit,
  });
  git(local, 'tag', 'v1.2.3');
  assert.throws(() => verifyTaggedSource(stable, local), /not reachable/);
});
