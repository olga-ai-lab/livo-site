import nodemailer from 'nodemailer';
import { ENV } from './_core/env';
import { notifyOwner } from './_core/notification';

// Interface para os dados do sinistro
export interface SinistroData {
  nome: string;
  cpfCnpj: string;
  email: string;
  telefone: string;
  numeroApolice?: string;
  dataOcorrido: string;
  relato: string;
  marca: 'livonius' | 'livo';
  protocolo: string;
  arquivos?: string[];
}

// Configuração do transporter
// Em produção, configure as variáveis de ambiente SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  // Se não houver configuração SMTP, usar modo de teste (log no console)
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log('[EmailService] SMTP não configurado. Usando modo de simulação.');
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

// Template de e-mail HTML para notificação de sinistro
const createEmailTemplate = (data: SinistroData): string => {
  const brandColor = data.marca === 'livonius' ? '#056677' : '#0284C7';
  const brandName = data.marca === 'livonius' ? 'Livonius MGA' : 'Livo MGA';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Novo Aviso de Sinistro</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: ${brandColor}; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                🚨 Novo Aviso de Sinistro
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                ${brandName} | Protocolo: ${data.protocolo}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              
              <!-- Dados do Segurado -->
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
                📋 Dados do Segurado
              </h2>
              <table role="presentation" style="width: 100%; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Nome:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.nome}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>CPF/CNPJ:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.cpfCnpj}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>E-mail:</strong></td>
                  <td style="padding: 8px 0; color: #333;"><a href="mailto:${data.email}" style="color: ${brandColor};">${data.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Telefone:</strong></td>
                  <td style="padding: 8px 0; color: #333;"><a href="tel:${data.telefone}" style="color: ${brandColor};">${data.telefone}</a></td>
                </tr>
              </table>

              <!-- Dados do Sinistro -->
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
                📄 Dados do Sinistro
              </h2>
              <table role="presentation" style="width: 100%; margin-bottom: 25px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 140px;"><strong>Nº Apólice:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${data.numeroApolice || 'Não informado'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Data Ocorrido:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${new Date(data.dataOcorrido).toLocaleDateString('pt-BR')}</td>
                </tr>
              </table>

              <!-- Relato -->
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
                📝 Relato do Ocorrido
              </h2>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 25px; border-left: 4px solid ${brandColor};">
                <p style="margin: 0; color: #333; line-height: 1.6;">${data.relato}</p>
              </div>

              ${data.arquivos && data.arquivos.length > 0 ? `
              <!-- Arquivos -->
              <h2 style="color: #333; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
                📎 Arquivos Anexados
              </h2>
              <ul style="margin: 0 0 25px 0; padding-left: 20px;">
                ${data.arquivos.map(arquivo => `<li style="color: #333; padding: 5px 0;">${arquivo}</li>`).join('')}
              </ul>
              ` : ''}

              <!-- CTA -->
              <div style="text-align: center; margin-top: 30px;">
                <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
                  Por favor, entre em contato com o segurado em até 24 horas úteis.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Este e-mail foi enviado automaticamente pelo sistema de Aviso de Sinistros do Grupo Livonius.
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Grupo Livonius. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Função principal de envio de notificação
export async function sendSinistroNotification(data: SinistroData): Promise<{ success: boolean; message: string }> {
  const transporter = createTransporter();
  
  // E-mail de destino da equipe de sinistros
  const destinatario = process.env.SINISTRO_EMAIL || 'sinistros@grupolivonius.com.br';
  
  const emailContent = {
    from: `"Grupo Livonius - Sistema" <${process.env.SMTP_USER || 'noreply@grupolivonius.com.br'}>`,
    to: destinatario,
    subject: `[${data.marca.toUpperCase()}] Novo Aviso de Sinistro - Protocolo ${data.protocolo}`,
    html: createEmailTemplate(data),
  };

  // Se não houver transporter configurado, usar notifyOwner como fallback
  if (!transporter) {
    console.log('[EmailService] SMTP não configurado. Usando notifyOwner como fallback.');
    
    const brandName = data.marca === 'livonius' ? 'Livonius MGA' : 'Livo MGA';
    const title = `🚨 Novo Aviso de Sinistro - ${brandName} [${data.protocolo}]`;
    const content = `
📋 NOVO AVISO DE SINISTRO
━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️ Protocolo: ${data.protocolo}
🏢 Marca: ${brandName}
📅 Data de Registro: ${new Date().toLocaleString('pt-BR')}

👤 DADOS DO SEGURADO
━━━━━━━━━━━━━━━━━━━━━━━━━
• Nome: ${data.nome}
• CPF/CNPJ: ${data.cpfCnpj}
• E-mail: ${data.email}
• Telefone: ${data.telefone}

📄 INFORMAÇÕES DO SINISTRO
━━━━━━━━━━━━━━━━━━━━━━━━━
• Nº Apólice: ${data.numeroApolice || 'Não informado'}
• Data do Ocorrido: ${new Date(data.dataOcorrido).toLocaleDateString('pt-BR')}

📝 RELATO:
${data.relato}

${data.arquivos && data.arquivos.length > 0 ? `📎 ARQUIVOS ANEXADOS: ${data.arquivos.length} arquivo(s)` : '📎 ARQUIVOS: Nenhum arquivo anexado'}

━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ AÇÃO NECESSÁRIA: Entrar em contato com o segurado em até 24h úteis.
    `.trim();

    try {
      const result = await notifyOwner({ title, content });
      if (result) {
        console.log(`[EmailService] Notificação enviada via notifyOwner: ${data.protocolo}`);
        return {
          success: true,
          message: 'Notificação enviada com sucesso para a equipe de sinistros.',
        };
      } else {
        return {
          success: false,
          message: 'Falha ao enviar notificação. Tente novamente.',
        };
      }
    } catch (error) {
      console.error('[EmailService] Erro ao usar notifyOwner:', error);
      return {
        success: false,
        message: 'Erro ao processar notificação.',
      };
    }
  }

  try {
    await transporter.sendMail(emailContent);
    console.log(`[EmailService] E-mail enviado com sucesso para ${destinatario}`);
    return {
      success: true,
      message: 'E-mail enviado com sucesso para a equipe de sinistros.',
    };
  } catch (error) {
    console.error('[EmailService] Erro ao enviar e-mail:', error);
    return {
      success: false,
      message: 'Falha ao enviar e-mail. Por favor, entre em contato pelo telefone.',
    };
  }
}

// Função para enviar confirmação ao segurado
export async function sendConfirmationToClient(data: SinistroData): Promise<{ success: boolean; message: string }> {
  const transporter = createTransporter();
  
  const brandColor = data.marca === 'livonius' ? '#056677' : '#0284C7';
  const brandName = data.marca === 'livonius' ? 'Livonius MGA' : 'Livo MGA';

  const confirmationHtml = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Confirmação de Aviso de Sinistro</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <tr>
            <td style="background-color: ${brandColor}; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                ✅ Aviso de Sinistro Recebido
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Olá, <strong>${data.nome}</strong>,
              </p>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Recebemos seu aviso de sinistro com sucesso. Nosso número de protocolo é:
              </p>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <span style="font-size: 28px; font-weight: 700; color: ${brandColor};">${data.protocolo}</span>
              </div>
              <p style="color: #333; font-size: 16px; line-height: 1.6;">
                Nossa equipe de sinistros entrará em contato em até <strong>24 horas úteis</strong> para dar continuidade ao seu processo.
              </p>
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                Guarde este e-mail para referência futura.
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                ${brandName} | Grupo Livonius
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const emailContent = {
    from: `"${brandName}" <${process.env.SMTP_USER || 'noreply@grupolivonius.com.br'}>`,
    to: data.email,
    subject: `Confirmação de Aviso de Sinistro - Protocolo ${data.protocolo}`,
    html: confirmationHtml,
  };

  if (!transporter) {
    console.log('[EmailService] SMTP não configurado. Usando notifyOwner para confirmação.');
    
    const confirmTitle = `✅ Confirmação de Sinistro Enviada - ${data.protocolo}`;
    const confirmContent = `
📧 CONFIRMAÇÃO ENVIADA AO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━

Cliente: ${data.nome}
E-mail: ${data.email}
Protocolo: ${data.protocolo}

O cliente foi notificado sobre o recebimento do aviso de sinistro.
    `.trim();

    try {
      await notifyOwner({ title: confirmTitle, content: confirmContent });
      return { success: true, message: 'Confirmação registrada.' };
    } catch (error) {
      console.error('[EmailService] Erro ao registrar confirmação:', error);
      return { success: false, message: 'Falha ao registrar confirmação.' };
    }
  }

  try {
    await transporter.sendMail(emailContent);
    return { success: true, message: 'Confirmação enviada ao cliente.' };
  } catch (error) {
    console.error('[EmailService] Erro ao enviar confirmação:', error);
    return { success: false, message: 'Falha ao enviar confirmação.' };
  }
}


// Interface para os dados da cotação
export interface CotacaoData {
  protocolo: string;
  marca: 'livonius' | 'livo';
  produto: string;
  nomeRazaoSocial: string;
  email: string;
  telefone: string;
  tipoPessoa: 'pf' | 'pj';
  cpfCnpj: string;
  dadosProduto?: Record<string, any>;
  coberturas?: string[];
}

// Nomes amigáveis dos produtos
const produtoNomes: Record<string, string> = {
  rco: 'RCO - Responsabilidade Civil do Transportador',
  solar: 'Seguro Energia Solar',
  garantia: 'Seguro Garantia',
  agro: 'Seguro Penhor Rural',
  engenharia: 'Seguro Riscos de Engenharia',
};

// Template de e-mail de confirmação de cotação
const createCotacaoConfirmationTemplate = (data: CotacaoData): string => {
  const brandColor = data.marca === 'livonius' ? '#056677' : '#7AB72D';
  const brandName = data.marca === 'livonius' ? 'Livonius MGA' : 'Livo MGA';
  const produtoNome = produtoNomes[data.produto] || data.produto;

  // Formatar dados do produto para exibição
  let dadosProdutoHtml = '';
  if (data.dadosProduto && Object.keys(data.dadosProduto).length > 0) {
    const items = Object.entries(data.dadosProduto)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        // Converter camelCase para texto legível
        const label = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .trim();
        return `<tr>
          <td style="padding: 8px 0; color: #666; width: 180px;"><strong>${label}:</strong></td>
          <td style="padding: 8px 0; color: #333;">${value}</td>
        </tr>`;
      })
      .join('');
    
    if (items) {
      dadosProdutoHtml = `
        <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
          📋 Detalhes da Cotação
        </h2>
        <table role="presentation" style="width: 100%; margin-bottom: 20px;">
          ${items}
        </table>
      `;
    }
  }

  // Formatar coberturas
  let coberturasHtml = '';
  if (data.coberturas && data.coberturas.length > 0) {
    coberturasHtml = `
      <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
        🛡️ Coberturas Solicitadas
      </h2>
      <ul style="margin: 0 0 20px 0; padding-left: 20px;">
        ${data.coberturas.map(c => `<li style="color: #333; padding: 5px 0;">${c}</li>`).join('')}
      </ul>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmação de Solicitação de Cotação</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background-color: ${brandColor}; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">
                ✅ Solicitação de Cotação Recebida
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                ${brandName}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Olá, <strong>${data.nomeRazaoSocial}</strong>!
              </p>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Recebemos sua solicitação de cotação para <strong>${produtoNome}</strong>. 
                Nossa equipe comercial está analisando seus dados e entrará em contato em breve.
              </p>

              <!-- Protocolo -->
              <div style="background-color: #f9f9f9; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed ${brandColor};">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Seu número de protocolo:</p>
                <span style="font-size: 32px; font-weight: 700; color: ${brandColor}; letter-spacing: 2px;">${data.protocolo}</span>
                <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Guarde este número para acompanhamento</p>
              </div>

              <!-- Resumo do Produto -->
              <div style="background-color: ${brandColor}10; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${brandColor};">
                <h3 style="margin: 0 0 10px 0; color: ${brandColor}; font-size: 16px;">
                  🏷️ Produto Solicitado
                </h3>
                <p style="margin: 0; color: #333; font-size: 18px; font-weight: 600;">
                  ${produtoNome}
                </p>
              </div>

              ${dadosProdutoHtml}
              ${coberturasHtml}

              <!-- Próximos Passos -->
              <h2 style="color: #333; font-size: 18px; margin: 25px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid ${brandColor};">
                📌 Próximos Passos
              </h2>
              <ol style="margin: 0 0 20px 0; padding-left: 20px; color: #333; line-height: 1.8;">
                <li>Nossa equipe analisará sua solicitação</li>
                <li>Entraremos em contato em até <strong>24 horas úteis</strong></li>
                <li>Você receberá a proposta personalizada por e-mail</li>
                <li>Após aprovação, emitiremos sua apólice</li>
              </ol>

              <!-- Contato -->
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                  📞 Precisa de ajuda?
                </h3>
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                  Entre em contato conosco:<br>
                  <strong>WhatsApp:</strong> (11) 99999-9999<br>
                  <strong>E-mail:</strong> contato@grupolivonius.com.br
                </p>
              </div>

              <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 25px;">
                Agradecemos a preferência!
              </p>
              <p style="color: #333; font-size: 14px; margin: 0;">
                <strong>Equipe ${brandName}</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f4; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                Este e-mail foi enviado automaticamente pelo sistema de cotações do Grupo Livonius.
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">
                © ${new Date().getFullYear()} Grupo Livonius. Todos os direitos reservados.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// Função para enviar confirmação de cotação ao cliente
export async function sendCotacaoConfirmation(data: CotacaoData): Promise<{ success: boolean; message: string }> {
  const transporter = createTransporter();
  
  const brandName = data.marca === 'livonius' ? 'Livonius MGA' : 'Livo MGA';
  const produtoNome = produtoNomes[data.produto] || data.produto;

  const emailContent = {
    from: `"${brandName}" <${process.env.SMTP_USER || 'noreply@grupolivonius.com.br'}>`,
    to: data.email,
    subject: `✅ Cotação Recebida - ${produtoNome} - Protocolo ${data.protocolo}`,
    html: createCotacaoConfirmationTemplate(data),
  };

  // Se não houver transporter configurado, usar notifyOwner como fallback
  if (!transporter) {
    console.log('[EmailService] SMTP não configurado. Registrando confirmação de cotação via notifyOwner.');
    
    const title = `📧 Confirmação de Cotação Enviada - ${data.protocolo}`;
    const content = `
📧 CONFIRMAÇÃO DE COTAÇÃO ENVIADA
━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️ Protocolo: ${data.protocolo}
🏢 Marca: ${brandName}
📦 Produto: ${produtoNome}

👤 DADOS DO CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━
• Nome: ${data.nomeRazaoSocial}
• ${data.tipoPessoa === 'pf' ? 'CPF' : 'CNPJ'}: ${data.cpfCnpj}
• E-mail: ${data.email}
• Telefone: ${data.telefone}

${data.coberturas && data.coberturas.length > 0 ? `🛡️ COBERTURAS SOLICITADAS
━━━━━━━━━━━━━━━━━━━━━━━━━
${data.coberturas.map(c => `• ${c}`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━
✅ O cliente foi notificado sobre o recebimento da solicitação de cotação.
⏰ Prazo para contato: 24 horas úteis
    `.trim();

    try {
      const result = await notifyOwner({ title, content });
      if (result) {
        console.log(`[EmailService] Confirmação de cotação registrada: ${data.protocolo}`);
        return {
          success: true,
          message: 'Confirmação de cotação registrada com sucesso.',
        };
      } else {
        return {
          success: false,
          message: 'Falha ao registrar confirmação de cotação.',
        };
      }
    } catch (error) {
      console.error('[EmailService] Erro ao registrar confirmação de cotação:', error);
      return {
        success: false,
        message: 'Erro ao processar confirmação de cotação.',
      };
    }
  }

  try {
    await transporter.sendMail(emailContent);
    console.log(`[EmailService] Confirmação de cotação enviada para ${data.email}`);
    return {
      success: true,
      message: 'Confirmação de cotação enviada com sucesso.',
    };
  } catch (error) {
    console.error('[EmailService] Erro ao enviar confirmação de cotação:', error);
    return {
      success: false,
      message: 'Falha ao enviar confirmação de cotação.',
    };
  }
}
