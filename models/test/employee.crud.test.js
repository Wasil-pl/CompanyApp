const { DB_URI } = require('../../const');
const Employee = require('../employee.model');
const Department = require('../department.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmployeeOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'Management' });
      await testEmployeeTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with findOne method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      expect(employee.firstName).to.be.equal('Amanda');
      expect(employee.lastName).to.be.equal('Doe');
      expect(employee.department).to.be.equal('Marketing');
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });

    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmployeeOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'Management' });
      await testEmployeeTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne({ firstName: 'Amanda' }, { $set: { firstName: 'Mark' } });
      const updatedEmployee = await Employee.findOne({ firstName: 'Mark' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Amanda' });
      employee.firstName = 'Mark';
      await employee.save();

      const updatedEmployee = await Employee.findOne({ firstName: 'Mark' });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany({}, { $set: { firstName: 'updatedMany' } });
      const employees = await Employee.find({ firstName: 'updatedMany' });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmployeeOne = new Employee({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      await testEmployeeOne.save();

      const testEmployeeTwo = new Employee({ firstName: 'Jonathan', lastName: 'Wilson', department: 'Management' });
      await testEmployeeTwo.save();

      const testEmployeeThree = new Employee({ firstName: 'Thomas', lastName: 'Jefferson', department: 'Management' });
      await testEmployeeThree.save();

      const testEmployeeFour = new Employee({ firstName: 'Emma', lastName: 'Cowell', department: 'Management' });
      await testEmployeeFour.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      const removeEmployee = await Employee.findOne({ firstName: 'Amanda', lastName: 'Doe', department: 'Marketing' });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove one document with "remove" method', async () => {
      const employee = await Employee.findOne({ firstName: 'Jonathan', lastName: 'Wilson', department: 'Management' });
      await employee.remove();
      const removedEmployee = await Employee.findOne({
        firstName: 'Jonathan',
        lastName: 'Wilson',
        department: 'Management',
      });
      expect(removedEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Populating data', () => {
    beforeEach(async () => {
      const testDepartmentOne = new Department({ _id: '5d9f1140f10a81216cfd4405', name: 'Marketing' });
      await testDepartmentOne.save();

      const testEmployeeOne = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: '5d9f1140f10a81216cfd4405',
      });
      await testEmployeeOne.save();
    });

    it('should properly populate one document with "findOne" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: '5d9f1140f10a81216cfd4405',
      }).populate('department');
      expect(employee.department.name).to.be.equal('Marketing');
      expect(employee.firstName).to.be.equal('Amanda');
      expect(employee.lastName).to.be.equal('Doe');
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  after(async () => {
    mongoose.models = {};
  });
});
