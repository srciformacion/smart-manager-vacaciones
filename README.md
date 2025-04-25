
# Vacaciones y Permisos

## Project info

**URL**: https://vacaciones.hhrrsrci.online

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/598b4b67-79b6-4e8a-88d3-f670afcb5781) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Excel Import/Export de Calendarios

### Formato de la plantilla Excel

La plantilla Excel para importar calendarios debe contener al menos las siguientes columnas:

- **ID Trabajador** o **Nombre del Trabajador**: Identificador único del trabajador.
- **Fecha**: En formato DD/MM/YYYY.
- **Turno**: Tipo de turno (Mañana, Tarde, Noche, 24h, Libre, Guardia, etc.).
- **Hora Inicio** (opcional): Hora de inicio del turno.
- **Hora Fin** (opcional): Hora de finalización del turno.
- **Horas** (opcional): Número de horas del turno.
- **Notas** (opcional): Comentarios o información adicional.

### Cómo usar el módulo de importación

1. En la sección de "Gestión de calendarios", selecciona la pestaña "Importar/Exportar Excel".
2. Haz clic en "Seleccionar archivo Excel" y elige tu archivo .xlsx o .xls.
3. Revisa los datos en la vista previa y edita cualquier dato incorrecto si es necesario.
4. Utiliza los filtros de trabajador y mes para visualizar subconjuntos de datos.
5. Haz clic en "Guardar Cambios" para confirmar la importación.

### Cómo usar el módulo de exportación

1. En la sección de "Importar/Exportar Excel", utiliza los filtros para seleccionar los datos que deseas exportar.
2. Haz clic en "Exportar a Excel".
3. El archivo se descargará automáticamente con el nombre "calendario_turnos_FECHA.xlsx".

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/598b4b67-79b6-4e8a-88d3-f670afcb5781) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
