namespace ClinicAPI.ViewModels
{
    public class UserUpdateModel
    {
        public string FullName { get; set; }
        //public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string AdditionalInfo { get; set; }
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }

    public class UserEditModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public string PhoneNumber { get; set; }
        //public string Email { get; set; }
        public string AdditionalInfo { get; set; }
    }

    public class UserViewModel
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
        public string RoleName { get; set; }
        public string PhoneNumber { get; set; }
        //public string Email { get; set; }
        public bool IsActive { get; set; }
        public string AdditionalInfo { get; set; }
    }
}
