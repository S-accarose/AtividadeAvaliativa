using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sabordobrasil.Models
{
    [Table("localidade")]
    public class Localidade
    {
        [Key]
        [Column("id_localidade")]
        public int Id { get; set; }

        [Required]
        [Column("nome_local")]
        public string NomeLocal { get; set; }
    }
}