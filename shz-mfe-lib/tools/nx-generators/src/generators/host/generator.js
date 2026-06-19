const { formatFiles, joinPathFragments } = require('nx/src/devkit-exports')
const {
  addAppProject,
  ensureProjectDoesNotExist,
  normalizeAppOptions,
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
} = require('../shared')
const {
  buildRsbuildConfig,
  buildMainTsx,
  buildAppTsx,
  buildRemotesTs,
} = require('./templates')

module.exports = async function hostGenerator(tree, schema) {
  const options = normalizeAppOptions(schema, 'host')
  ensureProjectDoesNotExist(tree, options.projectRoot)
  addAppProject(tree, options, ['scope:host', 'type:app'], true)
  writePackageJson(
    tree,
    options,
    {
      '@module-federation/enhanced': '^0.9.0',
      sonner: '^2.0.7',
    },
  )
  writeBaseAppFiles(tree, options, `${options.displayName} Host`)
  tree.write(joinPathFragments(options.projectRoot, 'rsbuild.config.ts'), buildRsbuildConfig(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/main.tsx'), buildMainTsx())
  tree.write(joinPathFragments(options.projectRoot, 'src/app.tsx'), buildAppTsx(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/remotes.ts'), buildRemotesTs())
  updateRootPackageScripts(tree, options)
  if (typeof formatFiles === 'function') await formatFiles(tree)
}
