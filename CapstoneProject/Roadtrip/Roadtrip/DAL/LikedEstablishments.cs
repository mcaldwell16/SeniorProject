namespace Roadtrip.DAL
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class LikedEstablishments
    {
        [Key]
        public int LEID { get; set; }

        public string EstablishmentID { get; set; }
        public string UserName { get; set; }
        public string EstablishmentName { get; set; }
    }
}