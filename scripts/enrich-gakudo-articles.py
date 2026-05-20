"""他22区の学童記事に千代田と同水準の共通テンプレ部分を追加するスクリプト。

挿入箇所:
  - 公立セクション末尾（=「## XX区エリアの **民間** 学童」直前）に TEMPLATE_A
  - 民間セクション末尾 + 「## エリア別の保活事情」直前 に TEMPLATE_B + TEMPLATE_C

千代田 (chiyoda-gakudo-guide.mdx)、23区まとめ (tokyo-23ku-gakudo-overview.mdx)、
民間ブランド比較 (private-gakudo-brands-guide.mdx) は対象外。
"""

from __future__ import annotations
import pathlib
import re
import sys

DIR = pathlib.Path("content/articles/education")
SKIP = {
    "chiyoda-gakudo-guide.mdx",
    "tokyo-23ku-gakudo-overview.mdx",
    "private-gakudo-brands-guide.mdx",
}

TEMPLATE_A = """### 減免制度

- 生活保護世帯: 全額免除
- 住民税非課税世帯: 大幅減免
- ひとり親世帯: 減額措置
- 兄弟同時利用: 第2子以降減額（区により有無あり）

最新の減免要件・金額は **区の入会案内** で確認を。

### 入会選考の基準（公立）

公立学童は申込が定員を上回ると点数化選考になります。主な要素：

- 保護者の就労状況（フルタイム/パート、勤務時間）
- 就労場所（自宅外/在宅）
- 家庭事情（ひとり親、介護、傷病）
- 兄弟在園加点
- 保育の継続性

最新の点数基準は **区の入会案内（毎年度更新）** で確認を。
"""

TEMPLATE_B = """### 主要な民間学童ブランドと特色

> 以下はブランドの一般的な特徴です。料金・カリキュラム・拠点の最新情報は **各社公式サイト** でご確認ください。

#### 🟦 キッズデュオ（Kids Duo）

- **特色**：**オールイングリッシュ環境** で過ごす英語学童の代表格
- **運営**：やる気スイッチグループ
- **対象**：年中〜小6
- **時間**：放課後〜19:00 程度、長期休暇は午前から
- **送迎**：学校→施設の送迎あり（拠点による）
- **料金目安**：週2回 月3〜4万円／週5回 月7〜9万円

#### 🟩 明光キッズ（明光学童）

- **特色**：明光義塾系の **学習指導と学童の融合**
- **対象**：小1〜小6
- **時間**：放課後〜19:00〜20:00
- **送迎**：学校→施設の送迎あり
- **料金目安**：月5〜7万円（オプション別）
- **特徴**：宿題サポート、漢字・計算指導

#### 🟧 KIDS BASE CAMP（キッズベースキャンプ）

- **特色**：**東急グループ** 系。多彩なイベント・体験プログラム
- **対象**：小1〜小6
- **時間**：放課後〜22:00 まで延長対応
- **送迎**：学校→施設→自宅まで対応
- **料金目安**：月7〜12万円（プランで増減）
- **特徴**：夕食提供、世界各国の文化体験イベント

#### 🟨 ウィズダムアカデミー

- **特色**：**受験塾と提携**、習い事オプション豊富
- **対象**：年少〜小6
- **時間**：放課後〜21:00〜22:00
- **送迎**：学校→施設→自宅
- **料金目安**：月8〜12万円（オプション含む）
- **特徴**：中学受験準備、複数の習い事を1ヶ所で

#### 🟪 学研キッズスペース

- **特色**：**学研グループ** の教材・知育プログラム
- **対象**：小1〜小6
- **時間**：放課後〜19:00 程度
- **送迎**：拠点による
- **料金目安**：月5〜8万円
- **特徴**：学研の通信教材活用、創作活動

#### 🟫 東進こども英語塾

- **特色**：**東進ハイスクール系の英語特化** 学童
- **対象**：年中〜小6
- **時間**：短時間（1.5〜2時間）の英語レッスン中心
- **料金目安**：月4〜6万円
- **特徴**：他学童と併用しやすい

### 民間学童 比較表

| ブランド | 英語 | 学習 | 体験 | 送迎 | 夕食 | 月額目安 |
|---|:---:|:---:|:---:|:---:|:---:|---|
| [キッズデュオ](https://kidsduo.com/) | ◎ | ○ | ○ | ○ | △ | 7〜9万円 |
| [明光キッズ](https://www.meikokids.jp/) | △ | ◎ | ○ | ○ | △ | 5〜7万円 |
| [KIDS BASE CAMP](https://www.kidsbasecamp.com/) | ○ | ○ | ◎ | ◎ | ◎ | 7〜12万円 |
| [ウィズダムアカデミー](https://wisdom-academy.com/) | ○ | ◎ | ○ | ◎ | ○ | 8〜12万円 |
| [学研キッズスペース](https://www.gakken-edu-sup.co.jp/) | △ | ◎ | ○ | △ | △ | 5〜8万円 |
| [ベネッセ学童クラブ](https://gakudou.benesse-style-care.co.jp/) | ○ | ◎ | ○ | ○ | △ | 6〜9万円 |

凡例：◎=強い／○=対応／△=オプション or 未対応

### 民間学童を選ぶ判断軸

1. **時間ニーズ**：何時まで預けたいか（19時前で十分 vs 21時以降）
2. **送迎ニーズ**：学校→施設、施設→自宅 が必要か
3. **教育方針**：英語没入／中学受験／知育／自由
4. **夕食**：必要なら必要、家で食べたいなら不要
5. **予算**：月5万円か10万円か15万円か（年額にすると60〜180万円）

### 民間学童でよくある追加費用

- 入会金: 3〜10万円
- 年会費: 1〜3万円
- 制服・教材費: 数千円〜数万円
- イベント・行事費: 都度
- 延長保育: 30分単位の追加課金
- スポット利用: 1日 3,000〜7,000円

契約前に **年額シミュレーション** を必ず実施を。
"""

TEMPLATE_C = """## 公立 vs 民間の年間総額シミュレーション

| パターン | 月額 | 年額 |
|---|---|---|
| 公立のみ（標準） | 8,000円 | 約 9〜13万円 |
| 公立＋民間（週1英語） | 8,000円＋3万円 | 約 45〜50万円 |
| 民間（標準コース） | 7万円 | 約 84万円 |
| 民間（フルパッケージ） | 12万円 | 約 144万円 |
| 民間＋オプション多 | 15万円 | 約 180万円 |

学童は **小1〜小3 × 月額** で **年30〜500万円** のレンジになり得るので、入学前に必ず試算を。
"""

# 民間セクションを示す見出し（区名は柔軟）
PRIVATE_HEADING_RE = re.compile(r"\n## [^\n]*エリアの \*\*民間\*\* 学童\n")
# エリア別保活事情の見出し（全区共通固定文言）
AREA_HEADING_RE = re.compile(r"\n## エリア別の保活事情\n")


def transform(text: str) -> str:
    """記事本文に共通テンプレを挿入する。"""

    def insert_a(match: re.Match[str]) -> str:
        return "\n" + TEMPLATE_A.rstrip() + "\n" + match.group(0)

    def insert_b_c(match: re.Match[str]) -> str:
        return (
            "\n"
            + TEMPLATE_B.rstrip()
            + "\n\n"
            + TEMPLATE_C.rstrip()
            + "\n"
            + match.group(0)
        )

    new_text, count_a = PRIVATE_HEADING_RE.subn(insert_a, text, count=1)
    if count_a != 1:
        raise RuntimeError("民間セクション見出しが見つかりませんでした")
    new_text, count_bc = AREA_HEADING_RE.subn(insert_b_c, new_text, count=1)
    if count_bc != 1:
        raise RuntimeError("エリア別の保活事情 見出しが見つかりませんでした")
    return new_text


def main() -> int:
    targets = sorted(
        p for p in DIR.glob("*-gakudo-guide.mdx") if p.name not in SKIP
    )
    for path in targets:
        original = path.read_text(encoding="utf-8")
        try:
            updated = transform(original)
        except RuntimeError as e:
            print(f"SKIP {path.name}: {e}", file=sys.stderr)
            continue
        path.write_text(updated, encoding="utf-8")
        print(f"updated: {path.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
