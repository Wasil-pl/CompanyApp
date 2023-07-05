const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {
  it('should throw an error if no "firstName", "lastName" or "department" arg', () => {
    const employee = new Employee({}); // create new Employee, but don't set `firstName`, `lastName` or `department` attr value

    employee.validate((err) => {
      expect(err.errors.firstName).to.exist;
      expect(err.errors.lastName).to.exist;
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName", "lastName" or "department" is not a string', () => {
    const cases = [{}, []];

    for (let firstName of cases) {
      const employee = new Employee({ firstName });

      employee.validate((err) => {
        expect(err.errors.firstName).to.exist;
      });
    }

    for (let lastName of cases) {
      const employee = new Employee({ lastName });

      employee.validate((err) => {
        expect(err.errors.lastName).to.exist;
      });
    }

    for (let department of cases) {
      const employee = new Employee({ department });

      employee.validate((err) => {
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if "firstName", "lastName" and "department" are okay', () => {
    const cases = {
      firstName: ['John', 'Jane'],
      lastName: ['Doe', 'Smith'],
      department: ['Marketing', 'Management'],
    };

    for (let firstName of cases.firstName) {
      for (let lastName of cases.lastName) {
        for (let department of cases.department) {
          const employee = new Employee({ firstName, lastName, department });

          employee.validate((err) => {
            expect(err).to.not.exist;
          });
        }
      }
    }
  });
});
