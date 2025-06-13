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
            // Caminho padrão se não enviar imagem
            string fotoPath = "/imgs/nopub.png";

            // Salva a imagem enviada na pasta wwwroot/imgs
            if (dto.Foto != null && dto.Foto.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Foto.FileName);
                var filePath = Path.Combine("wwwroot/imgs", fileName);
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
                IdLocalidade = dto.IdLocalidade,
                CriadoPor = dto.CriadoPor
            };

            _context.Pratos.Add(publicacao);
            _context.SaveChanges();

            return Ok(new { sucesso = true, publicacao });
        }

        // Exemplo de endpoint para listar publicações com nome do usuário criador
        [HttpGet("listar")]
        public IActionResult Listar()
        {
            var publicacoes = _context.Pratos
                .Include(p => p.UsuarioCriador)
                .Include(p => p.Localidade)
                .Select(p => new {
                    p.Id,
                    p.Nome,
                    p.Descricao,
                    p.Foto,
                    Localizacao = p.Localidade != null ? p.Localidade.NomeLocal : "",
                    NomeCriador = p.UsuarioCriador != null ? p.UsuarioCriador.Nome : ""
                })
                .ToList();

            return Ok(publicacoes);
        }
    }

    public class PublicacaoCadastroDto
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public int IdLocalidade { get; set; }
        public int CriadoPor { get; set; }
        public IFormFile? Foto { get; set; }
    }
}