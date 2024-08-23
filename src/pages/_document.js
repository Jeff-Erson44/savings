import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Lien vers le manifest.json */}
        <link rel="manifest" href="/manifest.json"/>
        
        {/* Icône pour la PWA */}
        <link rel="icon" href="/icons/icon.png" />

        {/* Couleur du thème pour la barre d'adresse sur mobile */}
        <meta name="theme-color" content="#317EFB" />

        {/* Autres balises meta ou links peuvent être ajoutés ici */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
