// 記事の最終更新日時を git の履歴から求める
import { execFileSync } from 'node:child_process';

/** ファイルを最後に変えたコミットの日時。最初のコミットしかなければ(公開後に変えていなければ) undefined */
export function getLastUpdated(filePath: string): Date | undefined {
	let dates: string[];
	try {
		dates = execFileSync('git', ['log', '--follow', '--format=%cI', '--', filePath], { encoding: 'utf8' })
			.split('\n')
			.filter(Boolean);
	} catch {
		return undefined;
	}
	return dates.length >= 2 ? new Date(dates[0]) : undefined;
}
