import { CameraIcon } from "../../img/CamaraIcon.js";

export function MyProfile() {
  return /* html */ `
        <div class="container">
  <h1>¡Hola, usuario!</h1>
  <br />

  <div class="card">
    <div class="info-card">
      <h3>Nombre de usuario</h3>
      <p id="nombre-usuario"></p>
    </div>
    <br />

    <div class="info-card">
      <h3>Email</h3>
      <a href="#placeholder" id="email-usuario"></a>
    </div>
    <br />

    <div class="info-card">
      <h3>Teléfono de contacto</h3>
      <p id="tel-usuario">+598 </p>
    </div>
  </div>

  <div class="profile-buttons">
  <button id="ShowPopup">Editar datos de perfil</button>
  <button id="DeleteAcc">Eliminar cuenta</button>
  </div>

  <div id="popup" class="popup">
    <div class="popup-content">
      <form style="display: flex; flex-direction: column;">
        <div class="perfil-image">
          <img id="profile-picture" src="https://avatar.iran.liara.run/public" alt="Foto de perfil">
          <label for="newPfp" class="camera-icon">
            <i class="fa-solid fa-camera">${CameraIcon()}</i>
          </label>
        </div>

        <div>
          <input type="file" id="newPfp" accept="image/*" hidden>
          <button id="uploadPfp" type="button" class="check-icon">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>

        <div>
          <label for="nombre">Nombre de usuario</label>
          <input type="text" id="nombre" name="nombre">
          <small class="advertencia-username hidden" style="color: red">El username debe tener más de 5 caracteres y menos de 16</small><br><br>

          <label for="email">Email</label>
          <input type="email" id="email" name="email"><br><br>

          <label for="telefono">Teléfono de contacto</label>
          <input type="tel" id="telefono" name="telefono">
        </div>

        <button type="submit" class="buttonUpdate" style="margin: 20px; background-color: #0d6efd; color: white; border-radius: 8px; padding: 7px 12px; border: none; justify-self: center;">Actualizar</button>
      </form>
    </div>
  </div>

  <div id="deletePopup" class="popupdelete" style= "display: none">
    <div class="deletePopup-content">
      <p>Esta acción es irreversible, eliminarán permanentemente tus datos.<p>
      <p style="color: red; font-size: 20px;">¿Deseas eliminar tu cuenta?</p>
      <button id="confirmarDelete">Eliminar</button>
    </div>
  </div>

</div>

        `;
}
