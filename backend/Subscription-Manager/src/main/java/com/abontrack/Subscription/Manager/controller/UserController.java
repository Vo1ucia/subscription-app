package com.abontrack.Subscription.Manager.controller;

import com.abontrack.Subscription.Manager.model.User;
import com.abontrack.Subscription.Manager.service.UserService;
import com.abontrack.Subscription.Manager.dto.UserDTO;
import com.abontrack.Subscription.Manager.dto.UserRequest;
import com.abontrack.Subscription.Manager.dto.PasswordRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; 
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*") // Ou configurez selon vos besoins de CORS
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<UserDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(convertToDTO(user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(convertToDTO(user));
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(convertToDTO(user));
    }

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody UserRequest request) {
        User user = convertToEntity(request);
        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(convertToDTO(createdUser), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        User user = convertToEntity(request);
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long id, 
            @Valid @RequestBody PasswordRequest request) {
        boolean success = userService.changePassword(id, request.getOldPassword(), request.getNewPassword());
        
        if (success) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Incorrect old password");
        }
    }

    @GetMapping("/view/profile")
    public ResponseEntity<UserDTO> getCurrentUserProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Récupérer le username depuis l'objet Authentication
        String username = authentication.getName();
        
        // Utiliser votre service existant
        User user = userService.getUserByUsername(username);
        
        // Convertir en DTO avec votre méthode existante
        return ResponseEntity.ok(convertToDTO(user));
    }

    @PatchMapping("/action/profile")
    public ResponseEntity<UserDTO> updateUserProfile(
            Authentication authentication, 
            @Valid @RequestBody UserDTO userData) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Récupérer le username depuis l'authentification
        String username = authentication.getName();
        
        // Récupérer l'utilisateur actuel
        User currentUser = userService.getUserByUsername(username);
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Ne mettre à jour que les champs fournis
        // Remarque: nous ne permettons pas de changer le mot de passe par cette méthode
        if (userData.getUsername() != null && !userData.getUsername().isEmpty()) {
            currentUser.setUsername(userData.getUsername());
        }
        
        if (userData.getEmail() != null && !userData.getEmail().isEmpty()) {
            currentUser.setEmail(userData.getEmail());
        }
        
        // N'oubliez pas d'ajouter d'autres champs si votre UserDTO en contient plus
        
        // Mettre à jour l'utilisateur
        User updatedUser = userService.updateUser(currentUser.getId(), currentUser);
        
        // Convertir en DTO et renvoyer
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

    @PostMapping("/action/profile/change-password")
    public ResponseEntity<?> changeCurrentUserPassword(
            Authentication authentication,
            @Valid @RequestBody PasswordRequest request) {
        
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        // Récupérer le username depuis l'objet Authentication
        String username = authentication.getName();
        
        // Récupérer l'utilisateur complet depuis la base de données
        User user = userService.getUserByUsername(username);
        
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Appeler la méthode de service pour changer le mot de passe
        boolean success = userService.changePassword(
                user.getId(), 
                request.getOldPassword(), 
                request.getNewPassword());
        
        if (success) {
            return ResponseEntity.ok().body(Map.of("message", "Mot de passe modifié avec succès"));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Ancien mot de passe incorrect"));
        }
    }


    // Méthode utilitaire pour convertir une entité en DTO
    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        // Ne pas inclure le mot de passe dans le DTO
        return dto;
    }

    // Méthode utilitaire pour convertir une requête en entité
    private User convertToEntity(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword()); // Le service s'occupera du hachage
        return user;
    }
}