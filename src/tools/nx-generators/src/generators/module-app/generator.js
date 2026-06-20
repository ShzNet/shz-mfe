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
  writeTemplateFiles,
} = require('../shared')
const { buildRsbuildConfig } = require('./templates/rsbuild-config')
const { buildMainTsx } = require('./templates/main')
const { buildMenuTs } = require('./templates/menu')
const { buildNavTsx } = require('./templates/nav')
const { buildShellTsx } = require('./templates/shell')
const { buildAppPageTsx } = require('./templates/pages/app')
const { buildDashboardPageTsx } = require('./templates/pages/dashboard')

const USER_TEMPLATE_FILES = [
  ['src/pages/users/index.tsx', 'index.tsx.template'],
  ['src/pages/users/types.ts', 'types.ts.template'],
  ['src/pages/users/config.ts', 'config.ts.template'],
  ['src/pages/users/data.ts', 'data.ts.template'],
  ['src/pages/users/helpers.ts', 'helpers.ts.template'],
  ['src/pages/users/columns.tsx', 'columns.tsx.template'],
  ['src/pages/users/components/user-form-dialog.tsx', 'components/user-form-dialog.tsx.template'],
]

module.exports = async function moduleAppGenerator(tree, schema) {
  const options = normalizeAppOptions(tree, schema, 'module')
  ensureProjectDoesNotExist(tree, options.projectRoot)
  addAppProject(tree, options, ['scope:remote', 'type:app'])
  writePackageJson(tree, options)
  writeBaseAppFiles(tree, options, `${options.displayName} (Standalone)`)

  const envName = `REMOTE_${toConstant(options.name)}_URL`
  const navComponentName = `${toPascal(options.name)}Nav`
  const shellComponentName = `${toPascal(options.name)}Shell`
  const menuItemTypeName = `${toPascal(options.name)}MenuItem`

  const p = (rel) => joinPathFragments(options.projectRoot, rel)

  tree.write(p('rsbuild.config.ts'), buildRsbuildConfig(options, envName))

  tree.write(p('src/main.tsx'), buildMainTsx())
  tree.write(p('src/menu.ts'), buildMenuTs(options, menuItemTypeName))
  tree.write(p('src/nav.tsx'), buildNavTsx(options, navComponentName))
  tree.write(p('src/shell.tsx'), buildShellTsx(shellComponentName, navComponentName))

  tree.write(p('src/pages/app.tsx'), buildAppPageTsx())
  tree.write(p('src/pages/dashboard.tsx'), buildDashboardPageTsx(options))
  writeUserFeatureTemplates(tree, options)

  updateRootPackageScripts(tree, options)
  if (typeof formatFiles === 'function') await formatFiles(tree)
}

function writeUserFeatureTemplates(tree, options) {
  writeTemplateFiles(tree, options.projectRoot, joinPathFragments(__dirname, 'templates', 'users'), USER_TEMPLATE_FILES, {
    __COMPONENTS_PACKAGE__: options.componentsPackage,
  })
}
