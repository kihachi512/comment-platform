import Head from "next/head";
import Link from "next/link";
import styles from "../styles/About.module.css";

export default function About() {
  return (
    <>
      <Head>
        <title>サービス概要 | Textories - 1時間で消えるメッセージサービス</title>
        <meta name="description" content="Textoriesは投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。匿名投稿・コメント機能、Googleログインでのユーザー名設定が可能。今この瞬間だけのコミュニケーションを楽しめます。" />
        <meta property="og:title" content="サービス概要 | Textories - 1時間で消えるメッセージサービス" />
        <meta property="og:description" content="Textoriesは投稿が1時間で自動的に見えなくなる新感覚のメッセージサービスです。匿名投稿・コメント機能、Googleログインでのユーザー名設定が可能。" />
        <meta name="twitter:title" content="サービス概要 | Textories" />
        <meta name="twitter:description" content="1時間で消える新感覚のメッセージサービスTextoriesの詳細をご紹介。" />
      </Head>
      <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <h1 className={styles.title}>💡 Textories とは？</h1>
        
        <div className={styles.conceptSection}>
          <h2 className={styles.conceptTitle}>🌟 コンセプト</h2>
          <p className={styles.conceptDescription}>
            <strong>「今この瞬間の気持ちを、気軽に表現できる場所」</strong><br />
            投稿が1時間で消えるから、深く考えすぎずに本音を投稿できます。
          </p>
        </div>

        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>✨ 特徴</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⏰</div>
              <h3>1時間で自動消去</h3>
              <p>投稿は1時間後に自動で見えなくなるので、一時的な感情も気軽に表現できます</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👤</div>
              <h3>匿名投稿可能</h3>
              <p>アカウント登録なしで匿名投稿できます。身バレを気にせず本音を投稿</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💬</div>
              <h3>簡単リアクション</h3>
              <p>ポジティブ・ネガティブの2つのボタンで気軽に反応できます</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔐</div>
              <h3>安全・プライベート</h3>
              <p>個人情報の蓄積がなく、デジタルデトックスにも最適</p>
            </div>
          </div>
        </div>

        <div className={styles.useCasesSection}>
          <h2 className={styles.sectionTitle}>🎯 こんな時に</h2>
          <div className={styles.useCaseList}>
            <div className={styles.useCase}>今日あった嬉しいことを誰かに聞いてもらいたい</div>
            <div className={styles.useCase}>愚痴を吐き出してスッキリしたい</div>
            <div className={styles.useCase}>ちょっとした悩みを相談したい</div>
            <div className={styles.useCase}>今の気持ちを言語化して整理したい</div>
            <div className={styles.useCase}>匿名で本音を語り合いたい</div>
          </div>
        </div>

        <div className={styles.howItWorksSection}>
          <h2 className={styles.sectionTitle}>🔄 仕組み</h2>
          <div className={styles.mechanismList}>
            <div className={styles.mechanism}>
              <strong>表示制限:</strong> 一般ユーザーは1時間以内の投稿のみ閲覧可能
            </div>
            <div className={styles.mechanism}>
              <strong>作者特権:</strong> 投稿者本人は24時間まで自分の投稿を確認可能
            </div>
            <div className={styles.mechanism}>
              <strong>自動削除:</strong> 24時間後にデータベースから完全削除
            </div>
          </div>
        </div>

        <div className={styles.authSection}>
          <h2 className={styles.sectionTitle}>👥 アカウント機能</h2>
          <div className={styles.authOptions}>
            <div className={styles.authOption}>
              <h3>🚶‍♂️ 匿名利用</h3>
              <p>アカウント不要で投稿・閲覧・コメントが可能</p>
            </div>
            <div className={styles.authOption}>
              <h3>🔑 Googleログイン</h3>
              <p>ユーザー名設定、マイページ、24時間投稿履歴が利用可能</p>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <p className={styles.ctaText}>
            今この瞬間の気持ちを、気軽に表現してみませんか？
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/new" className={styles.primaryCta}>
              📝 今すぐ投稿する
            </Link>
            <Link href="/" className={styles.secondaryCta}>
              投稿を見てみる
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
