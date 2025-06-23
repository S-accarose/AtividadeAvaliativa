using Microsoft.AspNetCore.Mvc;
using sabordobrasil.Models;
using System;
using System.Linq;

namespace sabordobrasil.Controllers
{
    [ApiController]
    [Route("api/publicacao")]
    public class ReacaoController : ControllerBase
    {
        private readonly SabordobrasilContext _context;

        public ReacaoController(SabordobrasilContext context)
        {
            _context = context;
        }

        [HttpPost("like")]
        public IActionResult Like([FromBody] ReacaoDto dto)
        {
            return RegistrarOuRemoverReacao(dto, "like");
        }

        [HttpPost("dislike")]
        public IActionResult Dislike([FromBody] ReacaoDto dto)
        {
            return RegistrarOuRemoverReacao(dto, "deslike");
        }

        private IActionResult RegistrarOuRemoverReacao(ReacaoDto dto, string tipo)
        {
            try
            {
                // Verifica se já existe uma reação igual
                var reacaoExistente = _context.Reacoes.FirstOrDefault(r =>
                    r.UsuarioId == dto.UsuarioId &&
                    r.PratoId == dto.PratoId &&
                    r.Tipo == tipo
                );

                // Se já existe, remove (desfazer)
                if (reacaoExistente != null)
                {
                    _context.Reacoes.Remove(reacaoExistente);
                    _context.SaveChanges();
                    return Ok(new { sucesso = true, removido = true });
                }

                // Se existe reação contrária (ex: já deu dislike e agora quer dar like), remove a anterior
                var reacaoContraria = _context.Reacoes.FirstOrDefault(r =>
                    r.UsuarioId == dto.UsuarioId &&
                    r.PratoId == dto.PratoId &&
                    r.Tipo != tipo
                );

                if (reacaoContraria != null)
                {
                    _context.Reacoes.Remove(reacaoContraria);
                }

                // Cria nova reação
                var novaReacao = new Reacao
                {
                    UsuarioId = dto.UsuarioId,
                    PratoId = dto.PratoId,
                    Tipo = tipo,
                    DataReacao = DateTime.Now
                };

                _context.Reacoes.Add(novaReacao);
                _context.SaveChanges();

                return Ok(new { sucesso = true, removido = false });
            }
            catch (Exception ex)
            {
                return BadRequest(new { sucesso = false, mensagem = "Erro: " + ex.Message });
            }
        }

        [HttpGet("reacoes/usuario/{usuarioId}")]
        public IActionResult ReacoesPorUsuario(int usuarioId)
        {
            var reacoes = _context.Reacoes
                .Where(r => r.UsuarioId == usuarioId)
                .GroupBy(r => r.Tipo)
                .Select(g => new
                {
                    tipo = g.Key.ToLower(), // "like" ou "deslike"
                    quantidade = g.Count()
                })
                .ToList();
            return Ok(reacoes);
        }
    }
}

public class ReacaoDto
{
    public int UsuarioId { get; set; }
    public int PratoId { get; set; }
}
