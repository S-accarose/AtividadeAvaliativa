using Microsoft.AspNetCore.Mvc;
using sabordobrasil.Models;
using System;
using System.Linq;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/publicacao")]
    public class DislikeController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public DislikeController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("dislike")]
        public IActionResult Dislike([FromBody] ReacaoDto dto)
        {
            // Verifica se já existe dislike desse usuário para esse prato
            var reacaoExistente = _context.Reacoes.FirstOrDefault(r =>
                r.UsuarioId == dto.UsuarioId &&
                r.PratoId == dto.PratoId &&
                r.Tipo == "deslike"
            );

            if (reacaoExistente != null)
            {
                return Ok(new { sucesso = false, mensagem = "Você já deu dislike neste prato." });
            }

            var reacao = new Reacao
            {
                UsuarioId = dto.UsuarioId,
                PratoId = dto.PratoId,
                Tipo = "deslike",
                DataReacao = DateTime.Now
            };

            _context.Reacoes.Add(reacao);
            _context.SaveChanges();

            return Ok(new { sucesso = true });
        }
    }
}