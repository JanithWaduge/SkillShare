package com.PAF.SkillShare.controller;

import com.PAF.SkillShare.model.User;
import com.PAF.SkillShare.service.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final String jwtSecret = "40bcc802c0c243feecfcf04d221c3a87ccb4993d09447355d0304b3055479e743c3e07b006176bc1bebb474fc78e9a1b05b7c9218b595ca3402a8dbd1e8c3e6b42bdb405e8ccee3980059935dc8a8fc3bd25ade134970bf5aae3c2c47633637c8ad07fae5ff0e11d81f5c34dba135c1ba795c462cb02ece693245e419f5e9df74515372e93a7af4dca1005b03f33feb7acda500477792e4823a8699b4894ba54c89af29375a1faeebec1dd06c125e33e46c980fb5e289a3a1c72d8f387d941ce3963729db446c8952724a84ef8f36a267b5b07f6a74beb9a135a4671c6c78142406d13b260086428f1025afb4ca17c90ee1bea13cd342083ca28f381b516e6ad";

    public UserController(UserService userService) {
        this.userService = userService;
    }

  @GetMapping("/profile")
public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String authHeader) {
    String token = authHeader.replace("Bearer ", "");
    String email = Jwts.parser()
            .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    Optional<User> user = userService.findByEmail(email);
    return user.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(404).build());
}

@PutMapping("/profile")
public ResponseEntity<Map<String, String>> updateUserProfile(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody UpdateProfileRequest request) {
    try {
        String token = authHeader.replace("Bearer ", "");
        String email = Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        User updatedUser = userService.updateUser(email, request.getName(), request.getBio(),
                request.getSkills(), request.getProfileImageUrl());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Your profile has been successfully updated.");
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "An error occurred while updating your profile. Please try again.");
        return ResponseEntity.status(400).body(response);
    }
}

@DeleteMapping("/profile")
public ResponseEntity<Map<String, String>> deleteUserProfile(@RequestHeader("Authorization") String authHeader) {
    try {
        String token = authHeader.replace("Bearer ", "");
        String email = Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        userService.deleteUser(email);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Your profile has been successfully deleted.");
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "An error occurred while deleting your profile. Please try again.");
        return ResponseEntity.status(400).body(response);
    }
}

    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.findAllUsers();
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, String>> signIn(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                    .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .compact();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Invalid email or password");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@RequestBody SignUpRequest signUpRequest) {
        try {
            User user = userService.registerUser(signUpRequest.getEmail(), signUpRequest.getPassword(), signUpRequest.getName(), signUpRequest.getBio(),signUpRequest.getSkills(), signUpRequest.getProfileImageUrl());
            String token = Jwts.builder()
                    .setSubject(user.getEmail())
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                    .signWith(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                    .compact();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Registration successful");
            response.put("token", token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }
}
class LoginRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class SignUpRequest {
    private String email;
    private String password;
    private String name;
    private String bio;
    private List<String> skills; // list of skills the user can teach or wants to learn
    private String profileImageUrl; // optional profile picture
    private String createdAt; // account creation date


    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}

class UpdateProfileRequest {
    private String name;
    private String bio;
    private List<String> skills; 
    private String profileImageUrl; 
    

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}