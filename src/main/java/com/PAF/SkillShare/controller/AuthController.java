package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.AuthRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        if ("test@example.com".equalsIgnoreCase(request.getEmail()) &&
                "password123".equals(request.getPassword())) {
            return ResponseEntity.ok(Map.of("token", "mock-jwt-token-12345"));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}
