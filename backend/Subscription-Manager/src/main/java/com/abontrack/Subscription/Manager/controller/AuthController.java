package com.abontrack.Subscription.Manager.controller;

import com.abontrack.Subscription.Manager.dto.AuthRequest;
import com.abontrack.Subscription.Manager.dto.AuthResponse;
import com.abontrack.Subscription.Manager.dto.RegisterRequest;
import com.abontrack.Subscription.Manager.model.User;
import com.abontrack.Subscription.Manager.repository.UserRepository;
import com.abontrack.Subscription.Manager.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Vérifier si l'utilisateur existe déjà
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .token(null)
                            .message("Username already exists")
                            .build()
            );
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .token(null)
                            .message("Email already exists")
                            .build()
            );
        }

        // Créer un nouvel utilisateur
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword())) // Utilisation de passwordHash
                .createdAt(LocalDateTime.now()) // Utilisation de LocalDateTime
                .updatedAt(LocalDateTime.now()) // Utilisation de LocalDateTime
                .build();
        
        userRepository.save(user);

        // Charger les détails de l'utilisateur et générer un token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(userDetails);
        
        return ResponseEntity.ok(
                AuthResponse.builder()
                        .token(token)
                        .message("User registered successfully")
                        .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            String token = jwtService.generateToken(userDetails);
            
            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .token(token)
                            .message("User authenticated successfully")
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                            .token(null)
                            .message("Invalid username or password")
                            .build()
            );
        }
    }
}