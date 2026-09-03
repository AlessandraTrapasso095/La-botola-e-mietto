import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Privacy policy",
  robots: { index: false, follow: false },
};

const listClasses =
  "text-text-muted mt-3 grid list-disc gap-2 pl-5 text-sm leading-relaxed";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Informativa ai sensi dell'art. 13 del Codice della Privacy"
      intro="Ai sensi dell'articolo 13 del codice della D.Lgs. 196/2003, vi rendiamo le seguenti informazioni."
      showReviewNotice={false}
    >
      <Text tone="muted">
        Noi di www.labotolaemietto.com riteniamo che la privacy dei nostri
        visitatori sia estremamente importante. Questo documento descrive
        dettagliatamente i tipi di informazioni personali raccolti e registrati
        dal nostro sito e come essi vengano utilizzati.
      </Text>

      <section>
        <Heading as="h2" size="md">
          File di Registrazione (Log Files)
        </Heading>
        <Text tone="muted" className="mt-3">
          Come molti altri siti web, il nostro utilizza file di log. Questi file
          registrano semplicemente i visitatori del sito - di solito una
          procedura standard delle aziende di hosting e dei servizi di analisi
          degli hosting.
        </Text>
        <Text tone="muted" className="mt-5">
          Le informazioni contenute nei file di registro comprendono indirizzi
          di protocollo Internet (IP), il tipo di browser, Internet Service
          Provider (ISP), informazioni come data e ora, pagine referral, pagine
          d&apos;uscita ed entrata o il numero di clic.
        </Text>
        <Text tone="muted" className="mt-5">
          Queste informazioni vengono utilizzate per analizzare le tendenze,
          amministrare il sito, monitorare il movimento degli utenti sul sito e
          raccogliere informazioni demografiche. Gli indirizzi IP e le altre
          informazioni non sono collegate a informazioni personali che possono
          essere identificate, dunque tutti i dati sono raccolti in forma
          assolutamente anonima.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Finalità del trattamento
        </Heading>
        <Text tone="muted" className="mt-3">
          I dati possono essere raccolti per una o più delle seguenti finalità:
        </Text>
        <ul className={listClasses}>
          <li>
            fornire l&apos;accesso ad aree riservate del Portale e di
            Portali/siti collegati con il presente e all&apos;invio di
            comunicazioni anche di carattere commerciale, notizie, aggiornamenti
            sulle iniziative di questo sito e delle società da essa controllate
            e/o collegate e/o Sponsor.
          </li>
          <li>
            eventuale cessione a terzi dei suddetti dati, sempre finalizzata
            alla realizzazione di campagne di email marketing ed all&apos;invio
            di comunicazioni di carattere commerciale.
          </li>
          <li>eseguire gli obblighi previsti da leggi o regolamenti;</li>
          <li>gestione contatti;</li>
        </ul>
      </section>

      <section>
        <Heading as="h2" size="md">
          Modalità del trattamento
        </Heading>
        <Text tone="muted" className="mt-3">
          I dati verranno trattati con le seguenti modalità:
        </Text>
        <ul className={listClasses}>
          <li>raccolta dati con modalità single-opt, in apposito database;</li>
          <li>
            registrazione ed elaborazione su supporto cartaceo e/o magnetico;
          </li>
          <li>
            organizzazione degli archivi in forma prevalentemente automatizzata,
            ai sensi del Disciplinare Tecnico in materia di misure minime di
            sicurezza, Allegato B del Codice della Privacy.
          </li>
        </ul>
      </section>

      <section>
        <Heading as="h2" size="md">
          Natura obbligatoria
        </Heading>
        <Text tone="muted" className="mt-3">
          Tutti i dati richiesti sono obbligatori.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Diritti dell&apos;interessato
        </Heading>
        <Text tone="muted" className="mt-3">
          Ai sensi ai sensi dell&apos;art. 7 (Diritto di accesso ai dati
          personali ed altri diritti) del Codice della Privacy, vi segnaliamo
          che i vostri diritti in ordine al trattamento dei dati sono:
        </Text>
        <ul className={listClasses}>
          <li>
            conoscere, mediante accesso gratuito l&apos;esistenza di trattamenti
            di dati che possano riguardarvi;
          </li>
          <li>
            essere informati sulla natura e sulle finalità del trattamento
          </li>
          <li>
            ottenere a cura del titolare, senza ritardo:
            <ul className="mt-2 grid list-disc gap-2 pl-5">
              <li>
                la conferma dell&apos;esistenza o meno di dati personali che vi
                riguardano, anche se non ancora registrati, e la comunicazione
                in forma intellegibile dei medesimi dati e della loro origine,
                nonché della logica e delle finalità su cui si basa il
                trattamento; la richiesta può essere rinnovata, salva
                l&apos;esistenza di giustificati motivi, con intervallo non
                minore di novanta giorni;
              </li>
              <li>
                la cancellazione, la trasformazione in forma anonima o il blocco
                dei dati trattati in violazione di legge, compresi quelli di cui
                non è necessaria la conservazione in relazione agli scopi per i
                quali i dati sono stati raccolti o successivamente trattati;
              </li>
              <li>
                l&apos;aggiornamento, la rettifica ovvero, qualora vi abbia
                interesse, l&apos;integrazione dei dati esistenti;
              </li>
              <li>
                opporvi in tutto o in parte per motivi legittimi al trattamento
                dei dati personali che vi riguardano ancorché pertinenti allo
                scopo della raccolta;
              </li>
            </ul>
          </li>
        </ul>

        <Text tone="muted" className="mt-5">
          Vi segnaliamo che il titolare del trattamento ad ogni effetto di legge
          è:
        </Text>
        <address className="text-text-muted mt-3 text-sm leading-relaxed not-italic">
          Mietto Giuliano
          <br />
          Via Stradona 27
          <br />
          35010 - Campo San Martino (Padova)
          <br />
          Tel/Fax: 3482607738
          <br />
          E-mail: info@labotolaemietto.com
          <br />
          P.IVA 01989480288
        </address>
        <Text tone="muted" className="mt-3">
          C.F. MTTGLN65S29B564C
        </Text>
        <Text tone="muted" className="mt-5">
          Per esercitare i diritti previsti all&apos;art. 7 del Codice della
          Privacy ovvero per la cancellazione dei vostri dati
          dall&apos;archivio, è sufficiente contattarci attraverso uno dei
          canali messi a disposizione.
        </Text>
        <Text tone="muted" className="mt-5">
          Tutti i dati sono protetti attraverso l&apos;uso di antivirus,
          firewall e protezione attraverso password.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Informazioni per i bambini
        </Heading>
        <Text tone="muted" className="mt-3">
          Riteniamo importante assicurare una protezione aggiunta ai bambini
          online. Noi incoraggiamo i genitori e i tutori a trascorrere del tempo
          online con i loro figli per osservare, partecipare e/o monitorare e
          guidare la loro attività online. Noi non raccogliamo dati personali di
          minori. Se un genitore o un tutore crede che il nostro sito abbia nel
          suo database le informazioni personali di un bambino, vi preghiamo di
          contattarci immediatamente (utilizzando la mail fornita) e faremo di
          tutto per rimuovere tali informazioni il più presto possibile.
        </Text>
        <Text tone="muted" className="mt-5">
          Questa politica sulla privacy si applica solo alle nostre attività
          online ed è valida per i visitatori del nostro sito web e per quanto
          riguarda le informazioni condivise e/o raccolte. Questa politica non
          si applica a qualsiasi informazione raccolta in modalità offline o
          tramite canali diversi da questo sito web.
        </Text>
      </section>

      <section>
        <Heading as="h2" size="md">
          Consenso
        </Heading>
        <Text tone="muted" className="mt-3">
          Usando il nostro sito web, acconsenti alla nostra politica sulla
          privacy e accetti i suoi termini. Se desideri ulteriori informazioni o
          hai domande sulla nostra politica sulla privacy non esitare a
          contattarci.
        </Text>
      </section>
    </LegalPage>
  );
}
