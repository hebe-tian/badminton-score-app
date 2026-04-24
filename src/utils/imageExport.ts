import type { ScoreHistoryEntry, ScoreHistory } from '../types';

interface GenerateImageOptions {
  entries: ScoreHistoryEntry[];
  mode: 'singles' | 'doubles' | 'wu-yun-lun-bi';
  matchResult?: ScoreHistory['matchResult'];
  teamAPlayers: string[];
  teamBPlayers: string[];
}

export function generateScoreImage({
  entries,
  mode: _mode, // 保留参数以保持接口兼容性，但当前未使用
  matchResult,
  teamAPlayers,
  teamBPlayers,
}: GenerateImageOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    // 配置参数 - 现代海报风格
    const width = 750;
    const headerHeight = 350; // 增加头部高度以容纳渐变和比分
    const padding = 40;
    const rowHeight = 60; // 稍微紧凑一点
    const tableHeaderHeight = 50;
    const footerHeight = 120;
    
    // 计算总高度
    const totalRows = Math.max(entries.length, 8);
    const height = headerHeight + tableHeaderHeight + (totalRows * rowHeight) + footerHeight + (padding * 2);

    // 设置高分屏清晰度
    const scale = 2;
    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // 1. 绘制白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // 2. 绘制渐变头部 (Blue to Cyan)
    const gradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
    gradient.addColorStop(0, '#3b82f6'); // blue-500
    gradient.addColorStop(1, '#06b6d4'); // cyan-500
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, headerHeight);

    // 3. 绘制头部文字
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    
    // 标题
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('🏸 BADMINTON MATCH', width / 2, 60);

    // 比分
    if (matchResult) {
      ctx.font = 'bold 96px sans-serif';
      ctx.fillText(`${matchResult.finalScore.teamA} : ${matchResult.finalScore.teamB}`, width / 2, 180);

      // 队伍名称
      ctx.font = '28px sans-serif';
      ctx.globalAlpha = 0.9;
      ctx.fillText(`${teamAPlayers.join(' / ')}  VS  ${teamBPlayers.join(' / ')}`, width / 2, 240);
      ctx.globalAlpha = 1.0;
    }

    // 4. 绘制表格区域
    let currentY = headerHeight + 40;
    
    // 表格头
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(padding, currentY, width - padding * 2, tableHeaderHeight);
    
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('#', padding + 20, currentY + 32);
    ctx.textAlign = 'center';
    ctx.fillText('PLAYER', width / 2, currentY + 32);
    ctx.textAlign = 'right';
    ctx.fillText('SCORE', width - padding - 20, currentY + 32);

    currentY += tableHeaderHeight;

    // 5. 绘制得分流水
    entries.forEach((entry, index) => {
      const isTeamA = entry.scoringSide === 'A';
      const isTeamB = entry.scoringSide === 'B';

      // 绘制行底色
      if (isTeamA) {
        ctx.fillStyle = '#fce7f3'; // pink-100
      } else if (isTeamB) {
        ctx.fillStyle = '#dbeafe'; // blue-100
      } else {
        ctx.fillStyle = index % 2 === 0 ? '#ffffff' : '#f8fafc';
      }
      
      // 使用圆角矩形逻辑（简化为直角矩形，Canvas画圆角较繁琐）
      ctx.fillRect(padding, currentY, width - padding * 2, rowHeight);

      // 绘制内容
      ctx.font = '26px sans-serif';
      ctx.fillStyle = '#334155';
      
      ctx.textAlign = 'left';
      ctx.fillText(`${entry.sequenceNumber.toString().padStart(2, '0')}`, padding + 20, currentY + 38);

      ctx.textAlign = 'center';
      const scorerName = entry.scorers?.join(' / ') || '';
      ctx.fillText(scorerName, width / 2, currentY + 38);

      ctx.textAlign = 'right';
      ctx.fillText(`A:${entry.teamAScore}-B:${entry.teamBScore}`, width - padding - 20, currentY + 38);

      currentY += rowHeight;
    });

    // 6. 绘制底部获胜方信息
    if (matchResult) {
      currentY += 40;
      ctx.textAlign = 'center';
      
      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px sans-serif';
      ctx.fillText('WINNER', width / 2, currentY);
      
      const winnerNames = matchResult.winner === 'A' ? teamAPlayers : teamBPlayers;
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 40px sans-serif';
      ctx.fillText(winnerNames.join(' / '), width / 2, currentY + 50);

      // 日期水印
      const date = new Date().toISOString().split('T')[0];
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '20px sans-serif';
      ctx.fillText(date, width / 2, height - 30);
    }

    // 7. 转换为 DataURL
    resolve(canvas.toDataURL('image/png'));
  });
}
