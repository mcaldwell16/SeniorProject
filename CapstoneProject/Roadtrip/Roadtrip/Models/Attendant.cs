namespace Roadtrip.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Attendant
    {
        [Key]
        public int AID { get; set; }

        [Required]
        public int UserID { get; set; }

        public int EventID { get; set; }

        public virtual Event Event { get; set; }

        public virtual Profile Profile { get; set; }
    }
}
