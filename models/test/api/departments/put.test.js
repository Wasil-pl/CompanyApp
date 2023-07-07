const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const Department = require('../../../department.model.js');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('PUT /api/departments', () => {
  before(async () => {
    const testDepartmentOne = new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' });
    await testDepartmentOne.save();
  });

  it('/:id should update chosen document and return success', async () => {
    const res = await request(server).put('/api/departments/5d9f1140f10a81216cfd4408').send({ name: 'Updated' });
    const updatedDepartment = await Department.findOne({ name: 'Updated' });
    expect(res.status).to.be.equal(200);
    expect(res.body.message).to.be.equal('OK');
    expect(updatedDepartment.name).to.be.equal('Updated');
  });

  after(async () => {
    await Department.deleteMany();
  });
});
