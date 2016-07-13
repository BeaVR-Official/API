/**
 * Created by kersal_e on 29/06/2016.
 */

var should = require('should');
var assert = require('assert');
var request = require('supertest');
var winston = require('winston');

describe('Routing', function() {
    var url = 'localhost:' + process.env.PORT || 3000;

    describe('Users', function() {
        it('should return an error trying to access users without token', function(done) {
            request(url)
                .get('/api/users')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                        done();
                    }
                    res.status.should.be.equal(401);
                    done();
                });
        });
        it('should return an error trying delete unexisting user without token', function(done) {
            request(url)
                .delete('/api/users/2000003')
                // end handles the response
                .end(function(err, res) {
                    if (err) {
                        throw err;
                        done();
                    }
                    res.status.should.be.equal(401);
                    done();
                });

        });

        it('should return an error trying delete users collection', function(done) {
            request(url)
                .delete('/api/users/')
                .end(function(err, res) {
                    if (err) {
                        throw err;
                        done();
                    }
                    res.status.should.be.equal(404);
                    done();
                });
        })
    });
});
