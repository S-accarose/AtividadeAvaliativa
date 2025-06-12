using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace sabordobrasil.Models
{
    [Table("prato")]
    public class Prato
    {
        [Key]
        [Column("id_prato")]
        public int Id { get; set; }

        [Required]
        [Column("nome")]
        public string Nome { get; set; }

        [Column("descricao")]
        public string? Descricao { get; set; }

        [Required]
        [Column("foto")]
        public string Foto { get; set; }

        [Column("id_localidade")]
        public int? LocalidadeId { get; set; }
        public Localidade? Localidade { get; set; }

        [Required]
        [Column("criado_por")]
        public int CriadoPorId { get; set; }
        public Usuario CriadoPor { get; set; }
    }
}