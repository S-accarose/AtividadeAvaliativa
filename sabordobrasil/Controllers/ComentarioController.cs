using Microsoft.AspNetCore.Mvc;
using sabordobrasil.Models;
using System;
using System.Linq;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/comentario")]
    public class ComentarioController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public ComentarioController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("adicionar")]
        public IActionResult Adicionar([FromBody] ComentarioDto dto)
        {
            try
            {
                var comentario = new Comentario
                {
                    UsuarioId = dto.UsuarioId,
                    PratoId = dto.PratoId,
                    Texto = dto.Texto,
                    DataComentario = DateTime.Now
                };

                _context.Comentarios.Add(comentario);
                _context.SaveChanges();

                return Ok(new { sucesso = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, mensagem = ex.Message });
            }
        }

        [HttpPut("editar")]
        public IActionResult Editar([FromBody] ComentarioEditarDto dto)
        {
            var comentario = _context.Comentarios.FirstOrDefault(c => c.Id == dto.ComentarioId && c.UsuarioId == dto.UsuarioId);
            if (comentario == null)
                return NotFound(new { sucesso = false, mensagem = "Comentário não encontrado." });

            comentario.Texto = dto.Texto;
            _context.SaveChanges();

            return Ok(new { sucesso = true });
        }

        [HttpGet("listar/{pratoId}")]
        public IActionResult ListarPorPrato(int pratoId)
        {
            var comentarios = _context.Comentarios
                .Where(c => c.PratoId == pratoId)
                .OrderByDescending(c => c.DataComentario)
                .Select(c => new {
                    c.Id,
                    c.Texto,
                    c.DataComentario,
                    Usuario = new {
                        c.Usuario.Id,
                        c.Usuario.Nome,
                        c.Usuario.Foto
                    }
                })
                .ToList();

            return Ok(comentarios);
        }

        
        [HttpDelete("apagar/{comentarioId}/{usuarioId}")]
        public IActionResult Apagar(int comentarioId, int usuarioId)
        {
            var comentario = _context.Comentarios.FirstOrDefault(c => c.Id == comentarioId && c.UsuarioId == usuarioId);
            if (comentario == null)
                return NotFound(new { sucesso = false, mensagem = "Comentário não encontrado ou não pertence ao usuário." });

            _context.Comentarios.Remove(comentario);
            _context.SaveChanges();

            return Ok(new { sucesso = true });
        }
    }

    public class ComentarioDto
    {
        public int UsuarioId { get; set; }
        public int PratoId { get; set; }
        public string Texto { get; set; }
    }

    public class ComentarioEditarDto
    {
        public int ComentarioId { get; set; }
        public int UsuarioId { get; set; }
        public string Texto { get; set; }
    }
}