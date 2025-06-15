using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sabordobrasil.Models
{
    [Table("usuario")]
    public class Usuario
    {
        [Key]
        [Column("id_usuario")]
        public int Id { get; set; }

        [Required]
        [Column("nome")]
        public string Nome { get; set; }

        [Required]
        [Column("email")]
        public string Email { get; set; }

        [Required]
        [Column("senha")]
        public string Senha { get; set; }

        [Required]
        [Column("foto")]
        public string Foto { get; set; }

        [Column("adm")]
        public bool Adm { get; set; }
    }
}