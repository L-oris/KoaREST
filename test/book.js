//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'test'

const server = require('../server'),
      //MongoDB
      mongoose = require('mongoose'),
      Book = require('../models/book'),
      //tests
      chai, {assert} = require('chai'),
      chaiHttp = require('chai-http')


//HTTP integration testing with Chai assertions
chai.use(chaiHttp)



describe('Books', () => {

  

})
