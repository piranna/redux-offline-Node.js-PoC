#!/usr/bin/env node

const poc = require('.')


const store = poc(function()
{
  setInterval(function()
  {
    store.dispatch({
      meta: {
        offline: {
          effect: {counter: 1, timestamp: new Date}
        }
      },
      type: 'counter'
    })
  }, 1000)
})
