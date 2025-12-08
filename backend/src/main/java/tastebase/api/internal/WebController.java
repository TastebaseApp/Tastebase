package tastebase.api.internal;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    @RequestMapping(value = "/{path:^(?!api|static|.*\\..*$).*$}")
    public String forward() {
        return "forward:/index.html";
    }
}
