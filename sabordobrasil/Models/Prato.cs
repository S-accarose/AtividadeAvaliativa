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
        public string Descricao { get; set; }

        [Column("foto")]
        public string? Foto { get; set; }

        [Column("localizacao")]
        public string Localizacao { get; set; }

        [Required]
        [Column("criado_por")]
        public int CriadoPor { get; set; }

        [ForeignKey("CriadoPor")]
        public Usuario? UsuarioCriador { get; set; }
    }
}