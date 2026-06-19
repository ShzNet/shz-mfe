const { formatFiles, joinPathFragments } = require('nx/src/devkit-exports')
const {
  addAppProject,
  ensureProjectDoesNotExist,
  normalizeAppOptions,
  toConstant,
  toPascal,
  updateRootPackageScripts,
  writeBaseAppFiles,
  writePackageJson,
} = require('../shared')
const {
  buildRsbuildConfig,
  buildMainTsx,
  buildConfigTs,
  buildNavTsx,
  buildAppPageTsx,
  buildDashboardPageTsx,
} = require('./templates')

module.exports = async function moduleAppGenerator(tree, schema) {
  const options = normalizeAppOptions(schema, 'module')
  ensureProjectDoesNotExist(tree, options.projectRoot)
  addAppProject(tree, options, ['scope:remote', 'type:app'])
  writePackageJson(tree, options)
  writeBaseAppFiles(tree, options, `${options.displayName} (Standalone)`)

  const envName = `REMOTE_${toConstant(options.name)}_URL`
  const navComponentName = `${toPascal(options.name)}Nav`

  tree.write(joinPathFragments(options.projectRoot, 'rsbuild.config.ts'), buildRsbuildConfig(options, envName))
  tree.write(joinPathFragments(options.projectRoot, 'src/main.tsx'), buildMainTsx())
  tree.write(joinPathFragments(options.projectRoot, 'src/config.ts'), buildConfigTs(options))
  tree.write(joinPathFragments(options.projectRoot, 'src/nav.tsx'), buildNavTsx(options, navComponentName))
  tree.write(joinPathFragments(options.projectRoot, 'src/pages/app.tsx'), buildAppPageTsx())
  tree.write(joinPathFragments(options.projectRoot, 'src/pages/dashboard.tsx'), buildDashboardPageTsx(options))
  updateRootPackageScripts(tree, options)
  if (typeof formatFiles === 'function') await formatFiles(tree)
}
