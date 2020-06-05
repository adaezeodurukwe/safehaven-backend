import { describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import app from '../../src';
import model from '../../src/models';
import { hashPassword } from '../../src/utils/passwordHash';

const { User, Consultant } = model;

chai.use(chaiHttp);

const testUser = {
  surName: 'Ayooluwaa',
  firstName: 'Olosundea',
  middleName: 'lovisgodd',
  email: 'olifedayo94@gmail.com',
  password: hashPassword('Password111'),
  phone: '07012221111',
  role: 'admin',
  verified: true,
  gender: 'male',
  dateOfBirth: '05/06/1994',
  nationality: 'Nigerian',
  address: 'No 34B Ewet, Housing Estate',
  createdAt: new Date(),
  updatedAt: new Date()
};

const testConsultant = {
  uuid: 'b38fcf44-b77f-4149-8d66-454d7a5eacdc',
  surName: 'Ayooluwaaaa',
  firstName: 'Olosundeeee',
  middleName: 'lovisgodrr',
  email: 'susan.abioya@kodehauz.com',
  password: hashPassword('Password112'),
  phone: '07012221112',
  role: 'consultant',
  verified: true,
  gender: 'male',
  dateOfBirth: '05/06/1994',
  nationality: 'Nigerian',
  address: 'No 34B Ewet, Housing Estate',
  createdAt: new Date(),
  updatedAt: new Date()
};

const consultantDetails = {
  uuid: '46204aae-fb3b-4d73-b9dd-725d70078191',
  user_uuid: 'b38fcf44-b77f-4149-8d66-454d7a5eacdc',
  specialization: 'psychologist',
  certificate: 'demo_url',
  validIdCard: 'demo_url',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('Consultant profile update', async () => {
  let token = '';

  before(async () => User.destroy({ where: { email: 'olifedayo94@gmail.com' } }));
  before(async () => User.destroy({ where: { email: 'susan@abioye.com' } }));
  before(async () => { await User.create(testUser); });
  before(async () => { await User.create(testConsultant); });
  before(async () => { await Consultant.create(consultantDetails); });
  before((done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'olifedayo94@gmail.com',
        password: 'Password111'
      })
      .end((err, res) => {
        token = res.body.data.token;
        done();
      });
  });

  describe('Admin can validate a consultant', () => {
    it('Should be able to validate a consultant when the role is admin', (done) => {
      chai.request(app)
        .put(`admin/validate-consultant-credentials/:${testConsultant.uuid}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.equal('Account Succesfully updated');
          done();
        });
    });

    it('Should not be able to update profile with invalid token', (done) => {
      chai.request(app)
        .patch(`/api/v1/profile/${token}akjkjkja`)
        .field('surName', 'Olaf')
        .field('firstName', 'Jeremy')
        .field('middleName', 'Mason')
        .field('email', 'kk@kodehassqz.com')
        .field('phone', '07015271191')
        .field('specialization', 'Psychologist')
        .field('gender', 'male')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.eql('error');
          done();
        });
    });

    it('Should not be able to update with existing users phone', (done) => {
      chai.request(app)
        .patch(`/api/v1/profile/${token}`)
        .field('surName', 'Olaf')
        .field('firstName', 'Jeremy')
        .field('middleName', 'Mason')
        .field('email', 'jabat98898h@gmail.com')
        .field('phone', '070122221001')
        .field('specialization', 'Psychologist')
        .field('gender', 'male')
        .end((err, res) => {
          console.log(res.body);
          expect(res).to.have.status(422);
          expect(res.body.status).to.eql('error');
          expect(res.body.error.msg).to.eql('Phone already in use');
          expect(res.body.error.param).to.eql('phone');
          done();
        });
    });

    it('Should not be able to update with existing users email', (done) => {
      chai.request(app)
        .patch(`/api/v1/profile/${token}`)
        .field('surName', 'Olaf')
        .field('firstName', 'Jeremy')
        .field('middleName', 'Mason')
        .field('email', 'susan@ab2ioye.com')
        .field('phone', '07012129912')
        .field('specialization', 'Psychologist')
        .field('gender', 'male')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.eql('error');
          expect(res.body.error.msg).to.eql('E-mail already in use');
          expect(res.body.error.param).to.eql('email');
          done();
        });
    });

    it('Should be prompted to input correct email format on incorrect email format', (done) => {
      chai.request(app)
        .patch(`/api/v1/profile/${token}`)
        .field('surName', 'Olaf')
        .field('firstName', 'Jeremy')
        .field('middleName', 'Mason')
        .field('email', 'kkkodehauz.com')
        .field('phone', '070132298411')
        .field('specialization', 'Psychologist')
        .field('gender', 'male')
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.eql('error');
          expect(res.body.error.msg).to.eql('Invalid value');
          expect(res.body.error.param).to.eql('email');
          done();
        });
    });
  });
});
