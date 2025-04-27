package com.PAF.SkillShare.repository;

import com.PAF.SkillShare.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
