namespace Roadtrip.Models
{ 
    using System;
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Comment
    {
        public int CommentID { get; set; }

        [Required]
        public string EstablishmentID { get; set; }

        [Column("Comment")]
        [DisplayName("Comment")]
        [Required]
        public string Comment1 { get; set; }

        [Required]
        public string UserName { get; set; }
        
        [Required]
        public string DateS { get; set; }
    }
}
