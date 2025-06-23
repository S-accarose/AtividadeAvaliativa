using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using sabordobrasil.Models;
using System;
using System.IO;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/publicacao")]
    public class PublicacaoController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public PublicacaoController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("cadastro")]
        public IActionResult Cadastro([FromForm] PublicacaoCadastroDto dto)
        {
            try
            {
                // Caminho padrão se não enviar imagem
                string fotoPath = "/imgs/nopub.png";

                // Salva a imagem enviada na pasta wwwroot/imgs
                if (dto.Foto != null && dto.Foto.Length > 0)
                {
                    var dirPath = Path.Combine("wwwroot", "imgs");
                    if (!Directory.Exists(dirPath))
                        Directory.CreateDirectory(dirPath);

                    var fileName = Guid.NewGuid() + Path.GetExtension(dto.Foto.FileName);
                    var filePath = Path.Combine(dirPath, fileName);
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        dto.Foto.CopyTo(stream);
                    }
                    fotoPath = "/imgs/" + fileName;
                }

                var publicacao = new Prato
                {
                    Nome = dto.Nome,
                    Descricao = dto.Descricao,
                    Foto = fotoPath,
                    Localizacao = dto.Localizacao,
                    CriadoPor = dto.CriadoPor
                };

                _context.Pratos.Add(publicacao);
                _context.SaveChanges();

                return Ok(new { sucesso = true, publicacao });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, mensagem = ex.Message });
            }
        }

        // Exemplo de endpoint para listar publicações com nome do usuário criador
        [HttpGet("listar")]
        public IActionResult Listar()
        {
            var pubs = _context.Pratos
                .Include(pub => pub.UsuarioCriador)
                .Select(pub => new
                {
                    pub.Id,
                    pub.Nome,
                    pub.Descricao,
                    pub.Foto,
                    Localizacao = pub.Localizacao,
                    NomeCriador = pub.UsuarioCriador != null ? pub.UsuarioCriador.Nome : ""
                })
                .ToList();
            return Ok(pubs);
        }

        [HttpDelete("deletar/{id}")]
        public IActionResult Deletar(int id, [FromQuery] int usuarioId)
        {
            var prato = _context.Pratos.FirstOrDefault(p => p.Id == id);
            if (prato == null)
                return NotFound(new { sucesso = false, mensagem = "Publicação não encontrada." });

            var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == usuarioId);
            if (usuario == null || !usuario.Adm)
                return Unauthorized(new { sucesso = false, mensagem = "Apenas administradores podem excluir publicações." });

            _context.Pratos.Remove(prato);
            _context.SaveChanges();

            return Ok(new { sucesso = true });
        }
    }

    public class PublicacaoCadastroDto
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Localizacao { get; set; }
        public int CriadoPor { get; set; }
        public IFormFile? Foto { get; set; }
    }
}