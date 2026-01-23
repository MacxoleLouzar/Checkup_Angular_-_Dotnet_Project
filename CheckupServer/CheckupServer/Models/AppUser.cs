using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace CheckupServer.Models
{
    public class AppUser:IdentityUser
    {
        [PersonalData]
        [Column(TypeName = "nvarchar(150)")]
        public string FirstName { get; set; }
        [PersonalData]
        [Column(TypeName = "nvarchar(150)")]
        public string LastName { get; set; }
    }
}
 