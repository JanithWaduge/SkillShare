package com.PAF.SkillShare.service;

import com.PAF.SkillShare.model.Post;
import com.PAF.SkillShare.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Get a post by ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Like a post
    public Post likePost(String id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.setLikes(post.getLikes() + 1); // Increment likes
            return postRepository.save(post);
        }
        return null;
    }

    // Delete a post
    public boolean deletePost(String id) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Add comment to a post
    public Post addComment(String id, String comment) {
        Optional<Post> postOptional = postRepository.findById(id);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            post.getComments().add(comment);  // Add comment
            return postRepository.save(post);
        }
        return null;
    }

    // Delete comment from a post
    public Post deleteComment(String postId, int commentIndex) {
        Optional<Post> postOptional = postRepository.findById(postId);
        if (postOptional.isPresent()) {
            Post post = postOptional.get();
            if (commentIndex >= 0 && commentIndex < post.getComments().size()) {
                post.getComments().remove(commentIndex);  // Remove comment by index
                return postRepository.save(post);
            }
        }
        return null;
    }
}
