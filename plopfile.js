module.exports = function Plop(plop) {
  plop.setGenerator('controller', {
    description: 'generate a new component',
    prompts: [{
      type: 'input',
      name: 'name',
      message: 'component name please...',
    }, {
      type: 'input',
      name: 'parentComponent',
      message: 'parent component name please... (leave empty for none)',
    }],
    actions: function Actions(data) {
      const actions = [];

      if (data.parentComponent.length > 0) {
        actions.push({
          type: 'add',
          path: 'src/renderer/components/{{properCase parentComponent}}/{{properCase name}}.vue',
          templateFile: 'plop-templates/component.hbs',
        });
      } else {
        actions.push({
          type: 'add',
          path: 'src/renderer/components/{{properCase name}}.vue',
          templateFile: 'plop-templates/component.hbs',
        });
      }

      return actions;
    },
  });
};
