import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Cookie policy",
  robots: { index: false, follow: false },
};

const linkClasses = "animated-underline text-accent-soft";

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy di Mietto Giuliano"
      intro="I Cookie sono costituiti da porzioni di codice installate all'interno del browser che assistono il Titolare nell’erogazione del Servizio in base alle finalità descritte. Alcune delle finalità di installazione dei Cookie potrebbero, inoltre, necessitare del consenso dell'Utente."
      showReviewNotice={false}
    >
      <Text tone="muted">
        Quando l’installazione di Cookies avviene sulla base del consenso, tale
        consenso può essere revocato liberamente in ogni momento seguendo le
        istruzioni contenute in questo documento.
      </Text>

      <section>
        <Heading as="h2" size="md">
          Cookie tecnici e di statistica aggregata
        </Heading>
        <Heading as="h3" size="sm" className="mt-5">
          Attività strettamente necessarie al funzionamento
        </Heading>
        <Heading as="h3" size="sm" className="mt-5">
          Attività di salvataggio delle preferenze, ottimizzazione e statistica
        </Heading>
      </section>

      <section>
        <Heading as="h2" size="md">
          Come posso esprimere il consenso all&apos;installazione di Cookie?
        </Heading>
        <Text tone="muted" className="mt-3">
          In aggiunta a quanto indicato in questo documento, l&apos;Utente può
          gestire le preferenze relative ai Cookie direttamente all&apos;interno
          del proprio browser ed impedire – ad esempio – che terze parti possano
          installarne. Tramite le preferenze del browser è inoltre possibile
          eliminare i Cookie installati in passato, incluso il Cookie in cui
          venga eventualmente salvato il consenso all&apos;installazione di
          Cookie da parte di questo sito. L&apos;Utente può trovare informazioni
          su come gestire i Cookie con alcuni dei browser più diffusi ad esempio
          ai seguenti indirizzi:{" "}
          <a
            className={linkClasses}
            href="https://support.google.com/chrome/answer/95647?hl=it&p=cpn_cookies"
          >
            Google Chrome
          </a>
          ,{" "}
          <a
            className={linkClasses}
            href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie"
          >
            Mozilla Firefox
          </a>
          ,{" "}
          <a
            className={linkClasses}
            href="https://support.apple.com/it-it/guide/safari/manage-cookies-and-website-data-sfri11471/"
          >
            Apple Safari
          </a>{" "}
          e{" "}
          <a
            className={linkClasses}
            href="http://windows.microsoft.com/it-it/windows-vista/block-or-allow-cookies"
          >
            Microsoft Internet Explorer
          </a>
          .
        </Text>
        <Text tone="muted" className="mt-5">
          Con riferimento a Cookie installati da terze parti, l&apos;Utente può
          inoltre gestire le proprie impostazioni e revocare il consenso
          visitando il relativo link di opt out (qualora disponibile),
          utilizzando gli strumenti descritti nella privacy policy della terza
          parte o contattando direttamente la stessa.
        </Text>
        <Text tone="muted" className="mt-5">
          Fermo restando quanto precede, si informano gli Utenti della
          possibilità di avvalersi delle informazioni fornite da{" "}
          <a className={linkClasses} href="http://www.youronlinechoices.eu/">
            YourOnlineChoices
          </a>{" "}
          (EU),{" "}
          <a
            className={linkClasses}
            href="https://www.networkadvertising.org/understanding-digital-advertising"
          >
            Network Advertising Initiative
          </a>{" "}
          (USA) e{" "}
          <a
            className={linkClasses}
            href="https://www.aboutads.info/consumers/"
          >
            Digital Advertising Alliance
          </a>{" "}
          (USA),{" "}
          <a
            className={linkClasses}
            href="https://youradchoices.ca/understanding-online-advertising/"
          >
            DAAC
          </a>{" "}
          (Canada),{" "}
          <a className={linkClasses} href="http://www.ddai.info/optout">
            DDAI
          </a>{" "}
          (Giappone) o altri servizi analoghi. Con questi servizi è possibile
          gestire le preferenze di tracciamento della maggior parte degli
          strumenti pubblicitari. Il Titolare, pertanto, consiglia agli Utenti
          di utilizzare tali risorse in aggiunta alle informazioni fornite dal
          presente documento.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Titolare del Trattamento dei Dati
        </Heading>
        <Text tone="muted" className="mt-3">
          Mietto Giuliano - Via Stradona 27 - 35010 Campo San Martino (Italia) -
          P.IVA 01989480288
        </Text>
        <Text tone="muted" className="mt-3">
          C.F. MTTGLN65S29B564C
        </Text>
        <Text tone="muted" className="mt-3">
          Indirizzo email del Titolare: info@labotolaemietto.com
        </Text>
        <Text tone="muted" className="mt-5">
          Dal momento che l&apos;installazione di Cookie e di altri sistemi di
          tracciamento operata da terze parti tramite i servizi utilizzati
          all&apos;interno di Mietto Giuliano non può essere tecnicamente
          controllata dal Titolare, ogni riferimento specifico a Cookie e
          sistemi di tracciamento installati da terze parti è da considerarsi
          indicativo. Per ottenere informazioni complete, l’Utente è invitato a
          consultare la privacy policy degli eventuali servizi terzi elencati in
          questo documento.
        </Text>
        <Text tone="muted" className="mt-5">
          Vista l&apos;oggettiva complessità di identificazione delle tecnologie
          basate sui Cookie l&apos;Utente è invitato a contattare il Titolare
          qualora volesse ricevere qualunque approfondimento relativo
          all&apos;utilizzo dei Cookie stessi tramite Mietto Giuliano.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Definizioni e riferimenti legali
        </Heading>

        <Heading as="h3" size="sm" className="mt-5">
          Dati Personali (o Dati)
        </Heading>
        <Text tone="muted" className="mt-3">
          Costituisce dato personale qualunque informazione che, direttamente o
          indirettamente, anche in collegamento con qualsiasi altra
          informazione, ivi compreso un numero di identificazione personale,
          renda identificata o identificabile una persona fisica.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Dati di Utilizzo
        </Heading>
        <Text tone="muted" className="mt-3">
          Sono le informazioni raccolte automaticamente attraverso Mietto
          Giuliano (anche da applicazioni di parti terze integrate in Mietto
          Giuliano), tra cui: gli indirizzi IP o i nomi a dominio dei computer
          utilizzati dall’Utente che si connette con Mietto Giuliano, gli
          indirizzi in notazione URI (Uniform Resource Identifier), l’orario
          della richiesta, il metodo utilizzato nell’inoltrare la richiesta al
          server, la dimensione del file ottenuto in risposta, il codice
          numerico indicante lo stato della risposta dal server (buon fine,
          errore, ecc.) il paese di provenienza, le caratteristiche del browser
          e del sistema operativo utilizzati dal visitatore, le varie
          connotazioni temporali della visita (ad esempio il tempo di permanenza
          su ciascuna pagina) e i dettagli relativi all’itinerario seguito
          all’interno dell’Applicazione, con particolare riferimento alla
          sequenza delle pagine consultate, ai parametri relativi al sistema
          operativo e all’ambiente informatico dell’Utente.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Utente
        </Heading>
        <Text tone="muted" className="mt-3">
          L&apos;individuo che utilizza Mietto Giuliano che, salvo ove
          diversamente specificato, coincide con l&apos;Interessato.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Interessato
        </Heading>
        <Text tone="muted" className="mt-3">
          La persona fisica cui si riferiscono i Dati Personali.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Responsabile del Trattamento (o Responsabile)
        </Heading>
        <Text tone="muted" className="mt-3">
          La persona fisica, giuridica, la pubblica amministrazione e qualsiasi
          altro ente che tratta dati personali per conto del Titolare, secondo
          quanto esposto nella presente privacy policy.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Titolare del Trattamento (o Titolare)
        </Heading>
        <Text tone="muted" className="mt-3">
          La persona fisica o giuridica, l&apos;autorità pubblica, il servizio o
          altro organismo che, singolarmente o insieme ad altri, determina le
          finalità e i mezzi del trattamento di dati personali e gli strumenti
          adottati, ivi comprese le misure di sicurezza relative al
          funzionamento ed alla fruizione di Mietto Giuliano. Il Titolare del
          Trattamento, salvo quanto diversamente specificato, è il titolare di
          Mietto Giuliano.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Mietto Giuliano (o questa Applicazione)
        </Heading>
        <Text tone="muted" className="mt-3">
          Lo strumento hardware o software mediante il quale sono raccolti e
          trattati i Dati Personali degli Utenti.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Servizio
        </Heading>
        <Text tone="muted" className="mt-3">
          Il Servizio fornito da Mietto Giuliano così come definito nei relativi
          termini (se presenti) su questo sito/applicazione.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Unione Europea (o UE)
        </Heading>
        <Text tone="muted" className="mt-3">
          Salvo ove diversamente specificato, ogni riferimento all’Unione
          Europea contenuto in questo documento si intende esteso a tutti gli
          attuali stati membri dell’Unione Europea e dello Spazio Economico
          Europeo.
        </Text>

        <Heading as="h3" size="sm" className="mt-5">
          Cookie
        </Heading>
        <Text tone="muted" className="mt-3">
          Piccola porzione di dati conservata all&apos;interno del dispositivo
          dell&apos;Utente.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Riferimenti legali
        </Heading>
        <Text tone="muted" className="mt-3">
          La presente informativa privacy è redatta sulla base di molteplici
          ordinamenti legislativi, inclusi gli artt. 13 e 14 del Regolamento
          (UE) 2016/679.
        </Text>
        <Text tone="muted" className="mt-5">
          Ove non diversamente specificato, questa informativa privacy riguarda
          esclusivamente Mietto Giuliano.
        </Text>
        <Text tone="muted" className="mt-5">
          Ultima modifica: 31/01/2020
        </Text>
      </section>
    </LegalPage>
  );
}
