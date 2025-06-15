using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sabordobrasil.Models
{
    [Table("comentario")]
    public class Comentario
    {
        [Key]
        [Column("id_comentario")]
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
        [Column("comentario")]
        public string Texto { get; set; }

        [Column("data_comentario")]
        public DateTime? DataComentario { get; set; }
    }
}