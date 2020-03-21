using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ClinicAPI.Authorization;
using ClinicAPI.Helpers;
using ClinicAPI.ViewModels;
using DAL;
using DAL.Core;
using DAL.Core.Interfaces;
using DAL.Models;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClinicAPI.Controllers
{
    [Authorize(
        AuthenticationSchemes = IdentityServerAuthenticationDefaults.AuthenticationScheme,
        Roles = RoleConstants.AdministratorRoleName)]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAccountManager _accountManager;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public AdminController(IAccountManager accountManager, IMapper mapper, IUnitOfWork unitOfWork, ILogger<AdminController> logger)
        {
            _accountManager = accountManager;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet("patients")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatients([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var patients = _unitOfWork.Patients.GetPatients();
            int totalCount = patients.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                int.TryParse(query, out int id);

                patients = patients
                    .Where(p => (
                        p.Id == id ||
                        p.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.PhoneNumber.Contains(query, StringComparison.OrdinalIgnoreCase)))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                patients = patients
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    patients,
                },
            });
        }

        [HttpGet("prescriptions")]
        [Authorize(Policies.ViewAllPrescriptionsPolicy)]
        public IActionResult GetPrescriptions([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            var prescriptions = _unitOfWork.Prescriptions.GetPrescriptions();
            int totalCount = prescriptions.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                int.TryParse(query, out int id);

                prescriptions = prescriptions
                    .Where(p =>
                        p.PatientId == id ||
                        p.Patient.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        p.Doctor.FullName.Contains(query, StringComparison.OrdinalIgnoreCase))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                prescriptions = prescriptions
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    prescriptions,
                },
            });
        }

        [HttpGet("medicines")]
        [Authorize(Policies.ViewAllMedicinesPolicy)]
        public IActionResult GetMedicines([FromQuery] int page, [FromQuery] int pageSize,
            [FromQuery] string findBy, [FromQuery] string query = null, [FromQuery] string filterDate = null)
        {
            var medicines = _unitOfWork.Medicines.Where(m => !m.IsDeleted);
            int totalCount = medicines.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                if (findBy == "IdCode")
                {
                    medicines = medicines
                    .Where(m => m.IdCode.Contains(query, StringComparison.OrdinalIgnoreCase));
                }
                else if (findBy == "Name")
                {
                    medicines = medicines
                    .Where(m => m.Name.Contains(query, StringComparison.OrdinalIgnoreCase));
                }
                else if (findBy == "ShortName")
                {
                    medicines = medicines
                    .Where(m => m.ShortName.Contains(query, StringComparison.OrdinalIgnoreCase));
                }
                else if (findBy == "Ingredient")
                {
                    var ingredients = _unitOfWork.Ingredients.GetAll();
                    var medicineIds = ingredients
                        .Where(i => i.Name.Contains(query, StringComparison.OrdinalIgnoreCase))
                        .Select(i => i.MedicineId);
                    medicines = medicines.Where(m => medicineIds.Contains(m.Id));
                }

                medicines = medicines.Skip((page - 1) * pageSize).Take(pageSize);
            }
            else
            {
                medicines = medicines
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            if (!string.IsNullOrWhiteSpace(filterDate))
            {
                DateTime date = DateTime.Parse(filterDate);
                medicines = medicines
                .Where(m => m.CreatedDate.Date == date.Date)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
            }

            var medicineVMs = _mapper.Map<IEnumerable<MedicineViewModel>>(medicines);

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    medicines = medicineVMs,
                },
            });
        }

        [HttpGet("medicines/{id}")]
        [Authorize(Policies.ViewAllMedicinesPolicy)]
        public async Task<IActionResult> GetMedicine(int id)
        {
            var medicine = await _unitOfWork.Medicines.FindAsync(id);
            if (medicine == null)
            {
                return NotFound();
            }

            return Ok(new[] { medicine, });
        }

        [HttpPost("medicines")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> AddMedicine([FromBody] MedicineModel medicineModel)
        {
            if (ModelState.IsValid)
            {
                if (medicineModel == null)
                {
                    return BadRequest($"{nameof(medicineModel)} can not be null.");
                }

                var medicine = _mapper.Map<Medicine>(medicineModel);
                _unitOfWork.Medicines.Add(medicine);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(medicine);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("medicines/{id}")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> UpdateMedicine(int id, [FromBody] MedicineModel medicineModel)
        {
            if (ModelState.IsValid)
            {
                if (medicineModel == null)
                {
                    return BadRequest($"{nameof(medicineModel)} can not be null.");
                }

                var medicine = _unitOfWork.Medicines.Find(id);

                if (medicine == null)
                {
                    return NotFound();
                }

                _mapper.Map(medicineModel, medicine);
                _unitOfWork.Medicines.Update(medicine);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(medicine);
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("medicines/{id}")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> DeleteMedicine(int id)
        {
            var medicine = _unitOfWork.Medicines.Find(id);

            if (medicine == null)
            {
                return NotFound();
            }

            medicine.IsDeleted = true;
            _unitOfWork.Medicines.Update(medicine);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok(medicine);
        }

        [HttpGet("ingredients/{medicineId}")]
        [Authorize(Policies.ViewAllMedicinesPolicy)]
        public IActionResult GetIngredients(int medicineId)
        {
            var ingredients = _unitOfWork.Ingredients.Where(i => i.MedicineId == medicineId);

            return Ok(ingredients);
        }

        [HttpPost("ingredients")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> AddIngredients([FromBody] IEnumerable<IngredientModel> ingredientModels)
        {
            if (ModelState.IsValid)
            {
                if (ingredientModels == null)
                {
                    return BadRequest($"{nameof(ingredientModels)} can not be null.");
                }

                var ingredients = _mapper.Map<IEnumerable<Ingredient>>(ingredientModels);
                _unitOfWork.Ingredients.AddRange(ingredients);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok();
            }

            return BadRequest();
        }

        [HttpDelete("ingredients/{medicineId}")]
        [Authorize(Policies.ManageAllMedicinesPolicy)]
        public async Task<IActionResult> RemoveIngredients(int medicineId)
        {
            var ingredients = _unitOfWork.Ingredients.Where(i => i.MedicineId == medicineId);
            if (!ingredients.Any())
            {
                return Ok();
            }

            _unitOfWork.Ingredients.RemoveRange(ingredients);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok();
        }

        [HttpGet("employees")]
        [Authorize(Policies.ViewAllUsersPolicy)]
        public async Task<IActionResult> GetEmployees([FromQuery] int page, [FromQuery] int pageSize, [FromQuery] string query = null)
        {
            string currentUserId = Utilities.GetUserId(User);
            var employees = _unitOfWork.Users.Where(e => (!e.IsDeleted && e.Id != currentUserId));
            int totalCount = employees.Count();

            if (!string.IsNullOrWhiteSpace(query))
            {
                employees = employees
                    .Where(e => (
                        e.UserName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        e.FullName.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        e.PhoneNumber.Contains(query, StringComparison.OrdinalIgnoreCase) ||
                        e.Email.Contains(query, StringComparison.OrdinalIgnoreCase)
                    ))
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }
            else
            {
                employees = employees
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize);
            }

            List<UserViewModel> employeeVMs = new List<UserViewModel>();

            foreach (var employee in employees)
            {
                var roleNames = await _accountManager.GetUserRolesAsync(employee);
                var roleName = roleNames.FirstOrDefault();
                var employeeVM = _mapper.Map<UserViewModel>(employee);
                employeeVM.RoleName = roleName;
                employeeVMs.Add(employeeVM);
            }

            return Ok(new[]
            {
                new
                {
                    totalCount,
                    employees = employeeVMs,
                },
            });
        }

        [HttpGet("employees/{id}")]
        [Authorize(Policies.ViewAllUsersPolicy)]
        public async Task<IActionResult> GetEmployee(string id)
        {
            var employee = _unitOfWork.Users
                .Where(e => e.Id == id)
                .FirstOrDefault();

            if (employee == null)
            {
                return NotFound();
            }

            var roleNames = await _accountManager.GetUserRolesAsync(employee);
            var roleName = roleNames.FirstOrDefault();
            var employeeVM = _mapper.Map<UserViewModel>(employee);
            employeeVM.RoleName = roleName;

            return Ok(new[] { employeeVM, });
        }

        [HttpPost("employees")]
        [Authorize(Policies.ManageAllUsersPolicy)]
        public async Task<IActionResult> AddEmployee([FromBody] UserEditModel userEditModel)
        {
            if (ModelState.IsValid)
            {
                if (userEditModel == null)
                {
                    return BadRequest($"{nameof(userEditModel)} can not be null.");
                }

                var user = _mapper.Map<User>(userEditModel);
                var (Succeeded, Errors) = await _accountManager.CreateUserAsync(user, new string[] { userEditModel.RoleName }, userEditModel.Password);
                if (!Succeeded)
                {
                    if (Errors[0].StartsWith("User name") && Errors[0].EndsWith("is already taken."))
                    {
                        return Ok(new
                        {
                            Message = $"Tên tài khoản {userEditModel.UserName} đã tồn tại!",
                        });
                    }
                    else
                    {
                        return NoContent();
                    }
                }

                return Ok(user);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("employees/{id}")]
        [Authorize(Policies.ManageAllUsersPolicy)]
        public async Task<IActionResult> UpdateEmployee(string id, [FromBody] UserEditModel userEditModel)
        {
            if (ModelState.IsValid)
            {
                if (userEditModel == null)
                {
                    return BadRequest($"{nameof(userEditModel)} can not be null.");
                }

                var user = await _accountManager.GetUserByIdAsync(id);
                if (user == null)
                {
                    return NotFound();
                }
                _mapper.Map(userEditModel, user);
                var result = await _accountManager.UpdateUserAsync(user, new string[] { userEditModel.RoleName });
                if (!result.Succeeded)
                {
                    return NoContent();
                }

                if (!string.IsNullOrWhiteSpace(userEditModel.Password))
                {
                    result = await _accountManager.ResetPasswordAsync(user, userEditModel.Password);
                    if (!result.Succeeded)
                    {
                        return NoContent();
                    }
                }

                return Ok(user);
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("employees/{id}")]
        [Authorize(Policies.ManageAllUsersPolicy)]
        public async Task<IActionResult> DeleteEmployee(string id)
        {
            var user = await _accountManager.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            if (user.IsDeleted)
            {
                return Ok(user);
            }

            user.UserName += $"{id}_removed";
            user.IsDeleted = true;
            var (Succeeded, Errors) = await _accountManager.UpdateUserAsync(user);
            if (!Succeeded)
            {
                return NoContent();
            }

            return Ok(user);
        }

        [HttpGet("diagnoses")]
        public IActionResult GetDiagnoses()
        {
            var diagnoses = _unitOfWork.Diagnoses.Where(d => !d.IsDeleted);

            return Ok(diagnoses);
        }

        [HttpGet("diagnoses/{id}")]
        public async Task<IActionResult> GetDiagnosis(int id)
        {
            var diagnosis = await _unitOfWork.Diagnoses.FindAsync(id);
            if (diagnosis == null)
            {
                return NotFound();
            }

            return Ok(new[] { diagnosis, });
        }

        [HttpPost("diagnoses")]
        public async Task<IActionResult> AddDiagnosis([FromBody] DiagnosisModel diagnosisModel)
        {
            if (ModelState.IsValid)
            {
                if (diagnosisModel == null)
                {
                    return BadRequest($"{nameof(diagnosisModel)} can not be null!");
                }

                var diagnosis = _mapper.Map<Diagnosis>(diagnosisModel);
                _unitOfWork.Diagnoses.Add(diagnosis);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(diagnosis);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("diagnoses/{id}")]
        public async Task<IActionResult> UpdateDiagnosis(int id, [FromBody] DiagnosisModel diagnosisModel)
        {
            if (ModelState.IsValid)
            {
                if (diagnosisModel == null)
                {
                    return BadRequest($"{nameof(diagnosisModel)} can not be null!");
                }

                var diagnosis = _unitOfWork.Diagnoses.Find(id);
                if (diagnosis == null)
                {
                    return NotFound();
                }

                _mapper.Map(diagnosisModel, diagnosis);
                _unitOfWork.Diagnoses.Update(diagnosis);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(diagnosis);
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("diagnoses/{id}")]
        public async Task<IActionResult> DeleteDiagnosis(int id)
        {
            var diagnosis = _unitOfWork.Diagnoses.Find(id);
            if (diagnosis == null)
            {
                return NotFound();
            }

            diagnosis.IsDeleted = true;
            _unitOfWork.Diagnoses.Update(diagnosis);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok(diagnosis);
        }

        [HttpGet("units")]
        public IActionResult GetUnits()
        {
            var units = _unitOfWork.Units.Where(u => !u.IsDeleted);

            return Ok(units);
        }

        [HttpGet("units/{id}")]
        public async Task<IActionResult> GetUnit(int id)
        {
            var unit = await _unitOfWork.Units.FindAsync(id);
            if (unit == null)
            {
                return NotFound();
            }

            return Ok(new[] { unit, });
        }

        [HttpPost("units")]
        public async Task<IActionResult> AddUnit([FromBody] UnitModel unitModel)
        {
            if (ModelState.IsValid)
            {
                if (unitModel == null)
                {
                    return BadRequest($"{nameof(unitModel)} can not be null!");
                }

                var unit = _mapper.Map<Unit>(unitModel);
                _unitOfWork.Units.Add(unit);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(unit);
            }

            return BadRequest(ModelState);
        }

        [HttpPut("units/{id}")]
        public async Task<IActionResult> UpdateUnit(int id, [FromBody] UnitModel unitModel)
        {
            if (ModelState.IsValid)
            {
                if (unitModel == null)
                {
                    return BadRequest($"{nameof(unitModel)} can not be null!");
                }

                var unit = _unitOfWork.Units.Find(id);
                if (unit == null)
                {
                    return NotFound();
                }

                _mapper.Map(unitModel, unit);
                _unitOfWork.Units.Update(unit);
                int result = await _unitOfWork.SaveChangesAsync();
                if (result < 1)
                {
                    return NoContent();
                }

                return Ok(unit);
            }

            return BadRequest(ModelState);
        }

        [HttpDelete("units/{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            var unit = _unitOfWork.Units.Find(id);
            if (unit == null)
            {
                return NotFound();
            }

            unit.IsDeleted = true;
            _unitOfWork.Units.Update(unit);
            int result = await _unitOfWork.SaveChangesAsync();
            if (result < 1)
            {
                return NoContent();
            }

            return Ok(unit);
        }

        [HttpGet("stat/patient")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPatientStat([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] string period = PeriodConstants.Day)
        {
            var patients = _unitOfWork.Patients.Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate);

            //var allPatients = patients
            //    .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate);
            //var newPatients = patients
            //    .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate && p.Status == PatientStatus.IsNew);
            //var checkedPatients = patients
            //    .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate && p.Status == PatientStatus.IsChecked);
            //var recheckPatients = patients
            //    .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate && p.Status == PatientStatus.IsRechecking);
            //var appointedPatients = patients
            //    .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate && p.AppointmentDate != null && p.Status != PatientStatus.IsChecked);

            if (period == PeriodConstants.Week)
            {
                var allByWeek = patients
                .GroupBy(p => new { p.CreatedDate.Year, Week = 1 + (p.CreatedDate.DayOfYear - 1) / 7 })
                .Select(p => new { x = p.Key, y = p.Count() });

                //var isNewByWeek = newPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, Week = 1 + (p.CreatedDate.DayOfYear - 1) / 7 })
                //    .Select(p => new { x = p.Key, y = p.Count() });

                //var isCheckedByWeek = checkedPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, Week = 1 + (p.CreatedDate.DayOfYear - 1) / 7 })
                //    .Select(p => new { x = p.Key, y = p.Count() });

                //var recheckByWeek = recheckPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, Week = 1 + (p.CreatedDate.DayOfYear - 1) / 7 })
                //    .Select(p => new { x = p.Key, y = p.Count() });

                //var appointedByWeek = appointedPatients
                //     .GroupBy(p => new { p.CreatedDate.Year, Week = 1 + (p.CreatedDate.DayOfYear - 1) / 7 })
                //     .Select(p => new { x = p.Key, y = p.Count() });

                return Ok(new[]
                {
                    new { all = allByWeek, },
                    //isNew = isNewByWeek,
                    //isChecked = isCheckedByWeek,
                    //recheck = recheckByWeek,
                    //appointed = appointedByWeek,
                });
            }

            if (period == PeriodConstants.Month)
            {
                var allByMonth = patients
                .GroupBy(p => new { p.CreatedDate.Year, p.CreatedDate.Month })
                .Select(p => new { x = p.Key, y = p.Count() });

                //var isNewByMonth = newPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, p.CreatedDate.Month })
                //    .Select(p => new { x = p.Key, y = p.Count() });

                //var isCheckedByMonth = checkedPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, p.CreatedDate.Month })
                //    .Select(p => new { x = p.Key, y = p.Count() });

                //var recheckByMonth = recheckPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, p.CreatedDate.Month })
                //    .Select(p => new { x = p.Key, y = p.Count() });

                //var appointedByMonth = appointedPatients
                //    .GroupBy(p => new { p.CreatedDate.Year, p.CreatedDate.Month })
                //    .Select(p => new { x = p.Key, y = p.Count() });
                return Ok(new[]
                {
                    new { all = allByMonth, },
                    //isNew = isNewByMonth,
                    //isChecked = isCheckedByMonth,
                    //recheck = recheckByMonth,
                    //appointed = appointedByMonth,
                });
            }

            var allByDay = patients
                .GroupBy(p => p.CreatedDate.Date)
                .Select(p => new { x = p.Key, y = p.Count() });

            //var isNewByDay = newPatients
            //    .GroupBy(p => p.CreatedDate.Date)
            //    .Select(p => new { x = p.Key, y = p.Count() });

            //var isCheckedByDay = checkedPatients
            //    .GroupBy(p => p.CreatedDate.Date)
            //    .Select(p => new { x = p.Key, y = p.Count() });

            //var recheckByDay = recheckPatients
            //    .GroupBy(p => p.CreatedDate.Date)
            //    .Select(p => new { x = p.Key, y = p.Count() });

            //var appointedByDay = appointedPatients
            //    .GroupBy(p => p.CreatedDate.Date)
            //    .Select(p => new { x = p.Key, y = p.Count() });

            return Ok(new[]
            {
                new { all = allByDay, },
                //isNew = isNewByDay,
                //isChecked = isCheckedByDay,
                //recheck = recheckByDay,
                //appointed = appointedByDay,
            });
        }

        [HttpGet("stat/prescription")]
        [Authorize(Policies.ViewAllPatientsPolicy)]
        public IActionResult GetPrescriptionStat([FromQuery] DateTime startDate, [FromQuery] DateTime endDate, [FromQuery] string period = PeriodConstants.Day)
        {
            var prescriptions = _unitOfWork.Prescriptions
                .Where(p => p.CreatedDate >= startDate && p.CreatedDate <= endDate);

            if (period == PeriodConstants.Week)
            {
                var byWeek = prescriptions
                    .GroupBy(p => new { p.CreatedDate.Year, Week = 1 + (p.CreatedDate.DayOfYear - 1) / 7 })
                    .Select(p => new { x = p.Key, y = p.Count() });

                return Ok(byWeek);
            }

            if (period == PeriodConstants.Month)
            {
                var byMonth = prescriptions
                    .GroupBy(p => new { p.CreatedDate.Year, p.CreatedDate.Month })
                    .Select(p => new { x = p.Key, y = p.Count() });

                return Ok(byMonth);
            }

            var byDay = prescriptions
                .GroupBy(p => p.CreatedDate.Date)
                .Select(p => new { x = p.Key, y = p.Count() });

            return Ok(byDay);
        }

        [HttpGet("stat/medicine")]
        [Authorize(Policies.ViewAllMedicinesPolicy)]
        public IActionResult GetMedicineStat()
        {
            var medicineStat = _unitOfWork.Medicines
                .Where(m => !m.IsDeleted)
                .Select(m => new { m.Name, m.Quantity, m.Unit });

            return Ok(medicineStat);
        }
    }
}
