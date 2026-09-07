# BookApp

BookApp är en Angular 20-frontend med ett .NET 9 Web API, SQLite och JWT-autentisering.

## Starta projektet efter kloning

Krav: .NET 9 SDK och Node.js med npm.

Starta backend från projektroten:

```powershell
dotnet restore .\Bookapp.Api\Bookapp.Api.csproj
dotnet run --project .\Bookapp.Api\Bookapp.Api.csproj
```

I Development skapas SQLite-databasen och en tillfällig JWT-nyckel automatiskt. Du kan använda .NET user-secrets om du vill behålla samma utvecklingsnyckel mellan omstarter:

```powershell
dotnet user-secrets set "Jwt:Key" "DIN-LÅNGA-LOKALA-NYCKEL" --project .\Bookapp.Api\Bookapp.Api.csproj
```

Starta frontend i en annan terminal:

```powershell
cd .\bookapp-client
npm install
npm start
```

Öppna `http://localhost:4200`.

Angulars lokala dev-server proxar `/api` till `http://localhost:5011`. I Azure serverar .NET samma Angular-build och frontend/API använder därför samma domän.

## Produktionskonfiguration

Production kräver en JWT-hemlighet i miljövariabeln `Jwt__Key`. En riktig hemlighet ska aldrig läggas i Git eller i `appsettings.json`.

Azure App Service ska dessutom använda en persistent SQLite-sökväg:

```text
ConnectionStrings__DefaultConnection=Data Source=/home/books.db
```
