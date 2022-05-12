const {Ability, AbilityBuilder} = require('@casl/ability')

const defineAbility = (user) => {
  const {can, cannot, build} = new AbilityBuilder(Ability)
  if(user) {
    switch(user.role) {
      case 'admin':
        can('manage', 'all')
        break
      case 'user':
        can('read', 'Category')
        can('read', 'Product')
        can('read', 'Tag')
        can('create', 'Address')
        can('read', 'Address')
        can('update', 'Address')
        can('delete', 'Address')
        can('create', 'Cart')
        can('read', 'Cart')
        can('update', 'Cart')
        can('delete', 'Cart')
        can('create', 'Order')
      default:
    }
  }

  return build()
}

function checkAbility(action, target) {
  return (req, res, next) => {
    const userAbility = defineAbility(req.user)
    if(userAbility.can(action, target)) {
      next();
    } else {
      res.send('this user is not authorized to access this link, ability forbidden')
    }
  }
}

module.exports = checkAbility
