import Header from "../App/Header"
import { Link } from "react-router-dom"
import * as ROUTES from "../../constants/routes"

//MUI
import Typography from "@mui/material/Typography"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Stack from "@mui/material/Stack"

export default function Landing() {
  return (
    <>
      <Header title="Welcome" />
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Spielbeschreibung
            </Typography>

            <Typography variant="body1">
              Dir wird eine Frage präsentiert zu welcher es vier mögliche Antworten gibt. Wenn du eine Antwort auswählst, siehst
              du, ob du korrekt geantwortet hast. Wurde die korrekte Antwort gewählt, so erhälst du die nächste Frage. Wenn du
              aber eine falsche Antwort auswählt, so ist das Spiel beendet und du hast verloren. Das Ziel ist es, alle Fragen
              korrekt zu beantworten. Es werden dir maximal 15 Fragen gestellt, welche du alle korrekt beantworten musst, um zu
              gewinnen. Mit jeder korrekt beantworteten Frage erhälst du einen Gewinn in Punkteform. Sollte jedoch eine Frage
              falsch beantwortet werden, so fällst du auf die letzte Sicherheitsstufe zurück. Bei der Sicherheitsstufe handelt es
              sich um eine Absicherung für dich. Wenn eine Sicherheitsstufe überschritten wurde, so wirst du selbst beim Verlieren
              des Spiels den gesicherten Punktestand erhalten. Für die Beantwortung einer Frage bleiben dir maximal 40 Sekunden.
              Dir stehen während dem Spiel zwei Arten von Joker zur Verfügung. Wie viele der Joker du einsetzen kannst, hängt
              davon ab, wie viele Joker du dir bereits erspielt hast.
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Themengebiete
            </Typography>

            <Typography variant="body1">
              Die zur Verfügung stehenden Themengebiete zum Spielen werden von deiner Lehrperson erstellt. Du kannst ein
              Themengebiet so oft wie du willst wiederholen. Hast du es aber einmal komplett erfolgreich beendet, kannst du es
              nicht mehr wiederholen.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Joker
            </Typography>
            <Typography variant="subtitle2" component="div">
              50 : 50
            </Typography>
            <Typography variant="body1">
              Es werden dir zwei zufällige falsche Antworten entfernt und du kannst noch aus zwei Antworten auswählen.
            </Typography>
            <Typography variant="subtitle2" component="div">
              Timer Stopp
            </Typography>
            <Typography variant="body1">Die Zeit wird angehalten und du kannst die Frage in Ruhe beantworten.</Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Aber Achtung: Der Einsatz eines Jokers führt zu einem Punktabzug von 1/4 deiner Gewinnsumme.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Level
            </Typography>

            <Typography variant="body1">
              Durch das erspielen von Punkten kannst du ein höheres Level erreichen. Für jedes Level werden 1 Million Punkte
              benötigt. Das Erreichen eines neuen Level lohnt sich für dich, denn so erhälst du einen neuen "50:50" und "Timer
              Stopp" Joker. Dein aktuelles Level und dein Punktestand kannst du in den den{" "}
              <Link to={ROUTES.ACHIEVEMENTS}>Achievements</Link> einsehen.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" component="h3">
              Abzeichen
            </Typography>

            <Typography variant="body1">
              Für besonders gute Leistungen kannst du verschiedene Abzeichen erhalten. Welche Abzeichen du bereits erspielt hast
              und welche noch nicht, kannst du in den <Link to={ROUTES.ACHIEVEMENTS}>Achievements</Link> einsehen.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}
