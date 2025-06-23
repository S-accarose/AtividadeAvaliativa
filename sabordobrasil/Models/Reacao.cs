using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sabordobrasil.Models
{
    [Table("reacao")]
    public class Reacao
    {
        [Key]
        [Column("id_reacao")]
        public int Id { get; set; }

        [Required]
        [Column("id_usuario")]
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }

        [Required]
        [Column("id_prato")]
        public int PratoId { get; set; }
        public Prato Prato { get; set; }

        [Required]
        [Column("tipo")]
        public string Tipo { get; set; } // "like" ou "deslike"

        [Column("data_reacao")]
        public DateTime? DataReacao { get; set; }
    }
}