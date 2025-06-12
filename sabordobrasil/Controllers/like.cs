using Microsoft.AspNetCore.Mvc;
using sabordobrasil.Models;
using System;
using System.Linq;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/publicacao")]
    public class LikeController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public LikeController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("like")]
        public IActionResult Like([FromBody] ReacaoDto dto)
        {
            // Verifica se já existe like desse usuário para esse prato
            var reacaoExistente = _context.Reacoes.FirstOrDefault(r =>
                r.UsuarioId == dto.UsuarioId &&
                r.PratoId == dto.PratoId &&
                r.Tipo == "like"
            );

            if (reacaoExistente != null)
            {
                return Ok(new { sucesso = false, mensagem = "Você já deu like neste prato." });
            }

            var reacao = new Reacao
            {
                UsuarioId = dto.UsuarioId,
                PratoId = dto.PratoId,
                Tipo = "like",
                DataReacao = DateTime.Now
            };

            _context.Reacoes.Add(reacao);
            _context.SaveChanges();

            return Ok(new { sucesso = true });
        }
    }

    public class ReacaoDto
    {
        public int UsuarioId { get; set; }
        public int PratoId { get; set; }
    }
}