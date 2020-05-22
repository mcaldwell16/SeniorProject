namespace Roadtrip.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Profile")]
    public partial class Profile
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Profile()
        {
            Attendants = new HashSet<Attendant>();
        }

        [Key]
        public int PPID { get; set; }

        [Required]
        [StringLength(256)]
        public string UserName { get; set; }

        [Required]
        [StringLength(501)]
        public string AboutMe { get; set; }

        [Required]
        [StringLength(20)]
        public string PrivacyFlag { get; set; }

        [Required]
        public string Follower { get; set; }

        [Required]
        public string Following { get; set; }

        [Required]
        public string PendingRequests { get; set; }

        [Required]
        public string RequestsPending { get; set; }

        public List<string> FollowerList { get; set; }
        public List<string> FollowingList { get; set; }
        public List<string> PendingRequestsList { get; set; }
        public List<string> RequestsPendingList { get; set; }
        public List<string> RecentActivityList { get; set; }
        public string PicLink { get; set; }


        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Attendant> Attendants { get; set; }
    }
}
