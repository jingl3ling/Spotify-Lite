const chai = require('chai');
const request = require('request');
const chaiHttp = require("chai-http");
const assert = require('chai').assert;
const app = require('../server');
const {expect} = chai;

chai.use(chaiHttp);

describe('Spotify test',()=>{
    describe("PUT /editProfile", function () {
        it("User could edit profile", function () {
            chai.request('http://localhost:3001')
            .put('/profile/user/info')
            .query({
                old_username: "test",
                new_username: "test",
                email: "test@gmail.com",
                password: "test"
             })
            .set('jwt','secret')
            .then(function (res) {
                expect(res.json).to.equal({success: true, msg: 'Successful updated profile.'});
             })
             .catch(function (err) {
                throw err;
             });
        });
    });

    describe("Get /user", function () {
        it("User (username: test) should be able to view the profile page", function () {
            chai.request('http://localhost:3001')
            .get('/profile/test')
            .set('jwt','secret')
            .then(function (res) {
                expect(res.body).to.have.string('Welcome,test');
             })
             .catch(function (err) {
                throw err;
             });
        });
    });

    describe("PUT /likeSong", function () {
        it("User could like a song", function () {
            chai.request('http://localhost:3001')
            .put('/profile/test/songs/song1')
            .set('jwt','secret')
            .then(function (res) {
                expect(res.json).to.equal({success:true});
             })
             .catch(function (err) {
                throw err;
             });
        });
    });

    describe("Get /likedSongs", function () {
        it("All 3 songs should be displayed for user: test", function () {
            chai.request('http://localhost:3001')
            .get('/profile/test/songs')
            .set('jwt','secret')
            .then(function (res) {
                expect(res.body).to.have.string('song1 song2 song3');
             })
             .catch(function (err) {
                throw err;
             });
        });
    });
})