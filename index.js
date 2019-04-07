const internetAvailable = require('internet-available')
const {applyMiddleware, compose, createStore} = require('redux')
const {offline} = require('@redux-offline/redux-offline')
const defaultConfig = require('@redux-offline/redux-offline/lib/defaults').default
const {AsyncNodeStorage} = require('redux-persist-node-storage')

const {persistOptions, queue} = defaultConfig


function detectNetwork(callback)
{
  let wasOnline

  function doCheck()
  {
    internetAvailable()
    .then(function()
    {
      if(wasOnline) return

      wasOnline = true
      callback(true)
    },
    function()
    {
      if(!wasOnline) return

      wasOnline = false
      callback(false)
    })
    .finally(doCheck)
  }

  doCheck()
}

function effect(effect, action)
{
  console.log(effect)

  return Promise.resolve()
}

function enqueue(array, action)
{
  const [item] = array
  if(!item) return [action]

  item.meta.offline.effect.counter += action.meta.offline.effect.counter

  return array
}

function reducer(state = {})
{
  // Dumb reducer since `createStore()` needs one, although we don't use `redux`
  // store, so we return state unmodified
  return state
}


module.exports = function(persistCallback)
{
  const config =
  {
    ...defaultConfig,
    detectNetwork,
    effect,
    persistCallback,
    persistOptions:
    {
      ...persistOptions,
      storage: new AsyncNodeStorage('storageDir')
    },
    queue:
    {
      ...queue,
      enqueue
    }
  }

  return createStore(reducer, offline(config))
}
